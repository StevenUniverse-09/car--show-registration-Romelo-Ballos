using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.GetRegistrationById;

public sealed class GetRegistrationByIdHandler
    : IQueryHandler<GetRegistrationByIdQuery,
        Result<GetRegistrationByIdResponse>>
{
    private readonly IAppDbContext _context;

    public GetRegistrationByIdHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<GetRegistrationByIdResponse>> HandleAsync(
        GetRegistrationByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        // Find the registration using its unique ID
        var registration = await _context.Registrations
            .AsNoTracking()
            .FirstOrDefaultAsync(
                r => r.Id == query.Id,
                cancellationToken);

        // Return an error if the registration does not exist
        if (registration is null)
        {
            return Result<GetRegistrationByIdResponse>.Failure(
                Error.NotFound(
                    "Registration.NotFound",
                    $"Registration with ID '{query.Id}' was not found."));
        }

        // Map the registration to the response
        var response = new GetRegistrationByIdResponse(
            registration.Id,
            registration.RegistrationNumber,
            DateTime.SpecifyKind(
                registration.RegistrationDate, DateTimeKind.Utc),
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

        // Return the successful response
        return Result<GetRegistrationByIdResponse>.Success(response);
    }
}
