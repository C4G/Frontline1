using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddSavingCommandValidator : AbstractValidator<AddSavingCommand>
    {
        public AddSavingCommandValidator()
        {
            RuleFor(x => x.UserId).NotNull();
            RuleFor(x => x.Amount).NotNull();
            RuleFor(x => x.FicoScore).NotNull();
            RuleFor(x => x.Files).NotEmpty();
        }
    }
}
