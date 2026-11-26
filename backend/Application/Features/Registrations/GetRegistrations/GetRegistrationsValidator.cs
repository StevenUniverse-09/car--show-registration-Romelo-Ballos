using FluentValidation;

namespace Application.Features.Registrations.GetRegistrations;

public sealed class GetRegistrationsValidator
    : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        // Validate participant name
        RuleFor(x => x.ParticipantName)
            .MaximumLength(150)
            .WithMessage("Participant name must not exceed 150 characters.");

        // Validate registration type
        RuleFor(x => x.Type)
            .IsInEnum()
            .When(x => x.Type.HasValue)
            .WithMessage("Registration type must be Exhibitor, Competitor, or VIP.");

        // Validate registration status
        RuleFor(x => x.Status)
            .IsInEnum()
            .When(x => x.Status.HasValue)
            .WithMessage("Status must be Pending, Confirmed, CheckedIn, or Cancelled.");

        // Validate page number
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");

        // Validate page size
        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("Page size must be between 1 and 50.");
    }
}
