using Application.Abstractions.Messaging;
using CarShow.Domain.Enums;
using Domain.Common;

namespace Application.Features.Registrations.GetRegistrations;

public sealed record GetRegistrationsQuery(
    string? ParticipantName = null,
    RegistrationType? Type = null,
    RegistrationStatus? Status = null,
    int Page = 1,
    int PageSize = 10
) : IQuery<Result<GetRegistrationsResponse>>;
