using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddResponseCommandValidator : AbstractValidator<AddResponseCommand>
    {
        public AddResponseCommandValidator()
        {
            RuleFor(x => x.QuestionId).NotNull();
        }
    }
}
