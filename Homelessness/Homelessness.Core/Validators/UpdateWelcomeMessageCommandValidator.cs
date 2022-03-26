using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateWelcomeMessageCommandValidator : AbstractValidator<UpdateWelcomeMessageCommand>
    {
        public UpdateWelcomeMessageCommandValidator()
        {
            RuleFor(x => x.Message).NotNull().NotEmpty();
        }
    }
}
