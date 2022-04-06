using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddSavingCommandValidator : AbstractValidator<AddSavingCommand>
    {
        public AddSavingCommandValidator()
        {
            RuleFor(x => x.UserId).NotNull();
            RuleFor(x => x.Value).NotNull();
            RuleFor(x => x.SavingsType).NotNull();
            RuleFor(x => x.Files).NotEmpty();
        }
    }
}
