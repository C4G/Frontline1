using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateSavingCommandValidator : AbstractValidator<UpdateSavingCommand>
    {
        public UpdateSavingCommandValidator()
        {
            RuleFor(x => x.SavingId).NotNull();
            RuleFor(x => x.Value).NotNull();
            RuleFor(x => x.SavingsType).NotNull();
        }
    }
}
