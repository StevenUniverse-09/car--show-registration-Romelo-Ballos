
using Application.Abstractions.Data;
using CarShow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // Registration table
    public DbSet<Registration> Registrations => Set<Registration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Registration>(entity =>
        {
            // Primary key
            entity.HasKey(r => r.Id);

            // Unique registration number
            entity.HasIndex(r => r.RegistrationNumber)
                  .IsUnique();

            // Prevent duplicate plate numbers
            entity.HasIndex(r => r.PlateNumber)
                  .IsUnique();

            // Required fields and maximum lengths
            entity.Property(r => r.RegistrationNumber)
                  .IsRequired()
                  .HasMaxLength(20);

            entity.Property(r => r.ParticipantName)
                  .IsRequired()
                  .HasMaxLength(150);

            entity.Property(r => r.ContactNumber)
                  .IsRequired()
                  .HasMaxLength(11);

            entity.Property(r => r.Email)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(r => r.Address)
                  .IsRequired()
                  .HasMaxLength(300);

            entity.Property(r => r.CarMakeModel)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(r => r.PlateNumber)
                  .IsRequired()
                  .HasMaxLength(15);

            // Store enums as strings
            entity.Property(r => r.RegistrationType)
                  .HasConversion<string>();

            entity.Property(r => r.Status)
                  .HasConversion<string>();

            // Registration fees and payments
            entity.Property(r => r.RegistrationFee)
                  .HasPrecision(12, 2);

            entity.Property(r => r.AmountPaid)
                  .HasPrecision(12, 2);
        });
    }
}
