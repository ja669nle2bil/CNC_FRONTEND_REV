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
        _context = context;
    }

    // User Registration
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
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
        var token = GenerateJwtToken(dbUser);
        return Ok(new { token });
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
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
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
        if (identity == null) return null;

        var userIdClaim = identity.FindFirst("userId");
        if (userIdClaim == null) return null;

        return int.TryParse(userIdClaim.Value, out var userId) ? userId : (int?)null;
    }
}