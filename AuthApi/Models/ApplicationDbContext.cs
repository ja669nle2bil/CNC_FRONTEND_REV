using Microsoft.EntityFrameworkCore;
namespace AuthAPI.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<TokenTransaction> TokenTransactions { get; set; } = null!;
}