using CarShow.Domain.Entities;
using FluentValidation;

namespace Application.Features.Registrations.CreateRegistration;

public sealed class CreateRegistrationValidator
    : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        // Validate participant name
        RuleFor(x => x.ParticipantName)
            .NotEmpty()
            .MaximumLength(150);

        // Validate Philippine mobile number
        RuleFor(x => x.ContactNumber)
            .NotEmpty()
            .Matches("^09[0-9]{9}$")
            .WithMessage(
                "Contact number must follow the 09XXXXXXXXX format.");

        // Validate email address
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        // Validate address
        RuleFor(x => x.Address)
            .NotEmpty()
            .MaximumLength(300);

        // Validate car make and model
        RuleFor(x => x.CarMakeModel)
            .NotEmpty()
            .MaximumLength(100);

        // Validate plate number
        RuleFor(x => x.PlateNumber)
            .NotEmpty()
            .MaximumLength(15);

        // Validate registration type
        RuleFor(x => x.RegistrationType)
            .IsInEnum()
            .WithMessage(
                "Registration type must be Exhibitor, Competitor, or VIP.");

        // Validate minimum amount paid
        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Amount paid cannot be negative.");

        // Validate maximum amount paid based on registration type
        RuleFor(x => x.AmountPaid)
            .LessThanOrEqualTo(x =>
                Registration.CalculateFee(x.RegistrationType))
            .WithMessage(
                "Amount paid cannot exceed the registration fee.")
            .When(x => Enum.IsDefined(x.RegistrationType));
    }
}
