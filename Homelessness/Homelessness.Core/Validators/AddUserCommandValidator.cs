using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddUserCommandValidator : AbstractValidator<AddUserCommand>
    {
        public AddUserCommandValidator()
        {
            RuleFor(x => x.Email).NotNull().NotEmpty();

            RuleFor(x => x.Password)
                .Length(6, 100)
                .WithMessage("The password must be at least 6 and at max 100 characters long.");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password)
                .WithMessage("The password and confirmation password do not match.");

            RuleFor(x => x.FirstName).NotNull().NotEmpty();
            RuleFor(x => x.LastName).NotNull().NotEmpty();
            RuleFor(x => x.RoleId).NotNull();
        }
    }
}
