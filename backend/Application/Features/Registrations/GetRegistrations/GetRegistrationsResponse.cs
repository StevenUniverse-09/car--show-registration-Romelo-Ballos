using CarShow.Domain.Enums;

namespace Application.Features.Registrations.GetRegistrations;

public sealed record GetRegistrationsResponse(
    IReadOnlyList<RegistrationItemResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);

public sealed record RegistrationItemResponse(
    Guid Id,
    string RegistrationNumber,
    DateTime RegistrationDate,
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType RegistrationType,
    RegistrationStatus Status,
    decimal RegistrationFee,
    decimal AmountPaid,
    string PaymentStatus
);
