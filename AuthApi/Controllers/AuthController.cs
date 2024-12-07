using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthAPI.Configurations;
using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtSettings _jwtSettings;
    private readonly ApplicationDbContext _context;

    public AuthController(IOptions<JwtSettings> jwtSettings, ApplicationDbContext context)
    {
        _jwtSettings = jwtSettings.Value;
        Console.WriteLine($"AuthController Constructor: JWT skey: {_jwtSettings.SecretKey}");
        Console.WriteLine($"AuthController Constructor: JWT Secret Key Length: {_jwtSettings.SecretKey.Length}");
        _context = context;
    }

    // User Registration
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        // Check if the user already exists:
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == user.Username);
        if (existingUser != null)
        {
            // User already exists - sends 409 http.
            return Conflict(new { message = "User with the given username already exists." });
        }
        // Hashing user's passwd (BCrypt implementation)
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        // Saving user to auth_db
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    // User Login:
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        // Validating user credentials
        var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
        if (dbUser == null || !BCrypt.Net.BCrypt.Verify(user.PasswordHash, dbUser.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password"});
        }
        // Generate and return JWT token
        Console.WriteLine($"AuthController: JWT Secret Key: {_jwtSettings.SecretKey}");
        Console.WriteLine($"AuthController: JWT Secret Key Length: {_jwtSettings.SecretKey.Length}");
        var token = GenerateJwtToken(dbUser);
        return Ok(new {
            token,
            message = $"Welcome, {dbUser.Username}! Login successful."
        });
    }

    // Checking Token Balance
    [HttpGet("check-tokens")]
    public async Task<IActionResult> CheckTokens()
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return Unauthorized();

        return Ok(new { tokens = user.TokenBalance });
    }

    // Using Tokens for Convert' action.
    [HttpPost("use-token")]
    public async Task<IActionResult> UseToken()
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null || user.TokenBalance <= 0)
        {
            return BadRequest(new { message = "Insufficient tokens" });
        }
        // Deducting a token..
        user.TokenBalance -= 1;
        _context.TokenTransactions.Add(new TokenTransaction { UserId = user.Id, Tokens = -1 });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Token used successfully", remainingTokens = user.TokenBalance });
    }

    // Action prototype: Adding tokens after payment.
    [HttpPost("add-tokens")]
    public async Task<IActionResult> AddTokens([FromBody] decimal amount)
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return Unauthorized();

        // Calculating tokens bought (e
        int tokensToAdd = (int)(amount * 3);
        user.TokenBalance += tokensToAdd;

        // Log payment and token transaction
        _context.Payments.Add(new Payment { UserId = user.Id, Amount = amount });
        _context.TokenTransactions.Add(new TokenTransaction { UserId = user.Id, Tokens = tokensToAdd });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tokens added successfully", totalTokens = user.TokenBalance });
    }

    // H: Generating JWT Tokensx
    private string GenerateJwtToken(User user)
    {
        Console.WriteLine($"Generating token for user: {user.Username}");
        var tokenHandler = new JwtSecurityTokenHandler();
        var trimmedKey = _jwtSettings.SecretKey.Trim();

        Console.WriteLine($"JWT Secret key(trimmed): {trimmedKey}");
        var key = Encoding.UTF8.GetBytes(trimmedKey);

        Console.WriteLine($"Key Byte Length: {key.Length}");
        if (key.Length == 0)
        {
            throw new InvalidOperationException("JWT Secret Key is invalid (zero-length)");
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("userId", user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // Extracting user Id from JWT registry, 'helper' function
    private int? GetUserIdFromToken()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        if (identity == null)
        {
            Console.WriteLine("Identity is null");
            return null;
        }

        Console.WriteLine("Claims:");
        foreach (var claim in identity.Claims)
        {
            Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
        }
        var userIdClaim = identity.FindFirst("userId");
        if (userIdClaim == null)
        {
            Console.WriteLine("userId claim is missing");
            return null;
        }

        if (!int.TryParse(userIdClaim.Value, out var userId)){
            Console.WriteLine("userId claim is not a valid integer");
            return null;
        }

        Console.WriteLine($"Extracted User ID: {userId}");
        return userId;
    }
}