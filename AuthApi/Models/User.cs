namespace AuthAPI.Models;
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // New fields for token system
    public int TokenBalance { get; set; } = 3; // Default to 3 tokens for free usage.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}