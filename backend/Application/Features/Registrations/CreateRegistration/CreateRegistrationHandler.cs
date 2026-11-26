using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using CarShow.Domain.Entities;
using CarShow.Domain.Enums;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.CreateRegistration;

public sealed class CreateRegistrationHandler
    : ICommandHandler<CreateRegistrationCommand,
        Result<CreateRegistrationResponse>>
{
    private readonly IAppDbContext _context;

    public CreateRegistrationHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CreateRegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        // Check if the plate number already exists
        bool plateExists = await _context.Registrations
            .AnyAsync(
                r => r.PlateNumber == command.PlateNumber,
                cancellationToken);

        if (plateExists)
        {
            return Result<CreateRegistrationResponse>.Failure(
                Error.Conflict(
                    "Registration.Conflict",
                    $"Plate number '{command.PlateNumber}' is already registered."));
        }

        // Get the latest registration number
        string? lastNumber = await _context.Registrations
            .OrderByDescending(r => r.RegistrationNumber.Length)
            .ThenByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        // Generate the next registration number
        int nextNumber = lastNumber is null
            ? 1
            : int.Parse(lastNumber.Split('-')[1]) + 1;

        string registrationNumber = $"CS27-{nextNumber:D4}";

        // Create the registration
        var registration = new Registration
        {
            RegistrationNumber = registrationNumber,
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName,
            ContactNumber = command.ContactNumber,
            Email = command.Email,
            Address = command.Address,
            CarMakeModel = command.CarMakeModel,
            PlateNumber = command.PlateNumber,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = Registration.CalculateFee(
                command.RegistrationType),
            AmountPaid = command.AmountPaid
        };

        // Save the registration to SQLite
        _context.Registrations.Add(registration);
        await _context.SaveChangesAsync(cancellationToken);

        // Prepare the response
        var response = new CreateRegistrationResponse(
            registration.Id,
            registration.RegistrationNumber,
            registration.RegistrationDate,
            registration.ParticipantName,
            registration.ContactNumber,
            registration.Email,
            registration.Address,
            registration.CarMakeModel,
            registration.PlateNumber,
            registration.RegistrationType,
            registration.Status,
            registration.RegistrationFee,
            registration.AmountPaid,
            registration.GetPaymentStatus()
        );

        return Result<CreateRegistrationResponse>.Success(response);
    }
}
