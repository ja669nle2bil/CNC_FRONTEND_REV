namespace AuthAPI.Models;

public class TokenTransaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int Tokens { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}