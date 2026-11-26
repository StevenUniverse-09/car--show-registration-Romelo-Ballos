
using CarShow.Domain.Entities;
using CarShow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Apply pending database migrations.
        await context.Database.MigrateAsync();

        // Prevent duplicate seeding.
        if (await context.Registrations.AnyAsync())
        {
            return;
        }

        string[] names =
        {
            "Juan Dela Cruz",
            "Maria Santos",
            "Jose Reyes",
            "Angela Garcia",
            "Mark Mendoza",
            "John Bautista",
            "Patricia Ramos",
            "Daniel Flores",
            "Christine Aquino",
            "Michael Rivera",
            "James Villanueva",
            "Sarah Gonzales",
            "Joshua Castillo",
            "Nicole Fernandez",
            "Christian Lopez",
            "Andrea Torres",
            "David Navarro",
            "Ashley Mercado",
            "Ryan Morales",
            "Sofia Cruz",
            "Kevin Domingo",
            "Jasmine Santiago",
            "Gabriel Perez",
            "Isabella Lim",
            "Juan Miguel Santos"
        };

        string[] cars =
        {
            "Toyota Supra MK4",
            "Honda Civic Type R",
            "Nissan Skyline R34",
            "Mazda RX-7",
            "Mitsubishi Lancer Evolution",
            "Subaru WRX STI",
            "Ford Mustang GT",
            "Chevrolet Camaro",
            "Toyota GR86",
            "Honda S2000",
            "Nissan GT-R",
            "BMW M3",
            "Mercedes-Benz C63",
            "Audi RS5",
            "Volkswagen Golf GTI",
            "Toyota Celica",
            "Honda Integra",
            "Nissan Silvia S15",
            "Mazda MX-5",
            "Mitsubishi Eclipse",
            "Porsche 911",
            "Ferrari 488",
            "Lamborghini Huracan",
            "McLaren 720S",
            "Toyota GR Supra"
        };

        var registrations = new List<Registration>();

        for (int i = 0; i < 25; i++)
        {
            int number = i + 1;

            // Assign registration type.
            RegistrationType type = i switch
            {
                < 10 => RegistrationType.Exhibitor,
                < 20 => RegistrationType.Competitor,
                _ => RegistrationType.VIP
            };

            // Assign registration status.
            RegistrationStatus status = i switch
            {
                < 6 => RegistrationStatus.Pending,
                < 16 => RegistrationStatus.Confirmed,
                < 22 => RegistrationStatus.CheckedIn,
                _ => RegistrationStatus.Cancelled
            };

            // Calculate the correct registration fee.
            decimal fee = Registration.CalculateFee(type);

            // Assign different payment amounts.
            decimal amountPaid = (i % 3) switch
            {
                0 => fee / 2,
                1 => 0m,
                _ => fee
            };

            registrations.Add(new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"CS27-{number:D4}",
                RegistrationDate = DateTime.UtcNow.AddDays(-25 + i),
                ParticipantName = names[i],
                ContactNumber = $"0917{number:D7}",
                Email = $"participant{number}@example.com",
                Address = "Sorsogon City, Philippines",
                CarMakeModel = cars[i],
                PlateNumber = $"SEED {number:D4}",
                RegistrationType = type,
                Status = status,
                RegistrationFee = fee,
                AmountPaid = amountPaid
            });
        }

        context.Registrations.AddRange(registrations);

        await context.SaveChangesAsync();
    }
}
