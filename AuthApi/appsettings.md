## FORMAT:
{
  "ConnectionStrings": {
<!-- SQLITE -->
    "DefaultConnection": "Server=localhost;Database=AuthDb;User Id=yourusername;Password=yourpassword;"
<!-- POSTGRESQL -->
    "DefaultConnection": "Host=localhost;Database=AuthDb;Username=yourusername;Password=yourpassword"
  },
  "JwtSettings": {
    "SecretKey": "YourVeryStrongSecretKey",
    "Issuer": "YourApp",
    "Audience": "YourAppUsers",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
