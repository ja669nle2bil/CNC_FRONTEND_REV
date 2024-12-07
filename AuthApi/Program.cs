using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AuthAPI.Models;
using AuthAPI.Configurations;
using DotNetEnv;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Loading env variables from .env file.
Env.Load();
Console.WriteLine($"Loaded JWT_SECRET_KEY: {Environment.GetEnvironmentVariable("JWT_SECRET_KEY")}");

var jwtSettings = new JwtSettings
{
    SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
                        ?? throw new InvalidOperationException("JWT_SECRET_KEY not found"),
    Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "AuthAPI",
    Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "AuthAPIUsers",
    ExpirationMinutes = 60
};
// Debugging: Output key information
Console.WriteLine($"Program.cs: Loaded JWT_SECRET_KEY: {jwtSettings.SecretKey}");
Console.WriteLine($"Program.cs: JWT Secret Key Length: {jwtSettings.SecretKey.Length}");

// Ensure no leading/trailing whitespace
var trimmedKey = jwtSettings.SecretKey.Trim();
Console.WriteLine($"Trimmed Key Length: {trimmedKey.Length}");

// Adding services & applying to container using IOptions pattern:
builder.Services.Configure<JwtSettings>(options => 
{
    options.SecretKey = jwtSettings.SecretKey;
    options.Issuer = jwtSettings.Issuer;
    options.Audience = jwtSettings.Audience;
    options.ExpirationMinutes = jwtSettings.ExpirationMinutes;
});

// Fetching environmental variables for DbContext using psql
var connectionString = $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
                       $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
                       $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
                       $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
                       $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")};";

// Adding dbContext with psql.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
    // options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        // IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
    };

    // Added debugging for JwtBearer.
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context => 
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            if (context.Exception is SecurityTokenExpiredException)
            {
                Console.WriteLine("Token has expired.");
            }
            else
            {
                Console.WriteLine($"Unexpected authentication failure: {context.Exception}");
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully.");
            var claimsIdentity = context.Principal.Identity as ClaimsIdentity;
            if (claimsIdentity != null)
            {
                foreach (var claim in claimsIdentity.Claims)
                {
                    Console.WriteLine($"Claim: {claim.Type}, Value: {claim.Value}");
                }
            }
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine("Token challenge triggered.");
            Console.WriteLine($"Error: {context.Error}");
            Console.WriteLine($"Error Description: {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactNativePolicy", policy =>
    {
        policy.WithOrigins("http://localhost:8081",
                            "http://localhost:",
                            "http://127.0.0.1")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
builder.Services.AddAuthorization();

var app = builder.Build();

// Middleware usage.
app.UseCors("ReactNativePolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();   // Mapping of existing cnotrollers.
app.Run();
// Fetching environmental variables for jwtSettings.
// builder.Services.Configure<JwtSettings>(options => 
// {
//     options.SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new ArgumentNullException("JWT_SECRET_KEY");
//     options.Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new ArgumentNullException("JWT_ISSUER");
//     options.Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new ArgumentNullException("JWT_AUDIENCE");
//     options.ExpirationMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRATION_MINUTES") ?? "60");
// });