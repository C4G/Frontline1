using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddQuestionCommandValidator : AbstractValidator<AddQuestionCommand>
    {
        public AddQuestionCommandValidator()
        {
            RuleFor(x => x.CourseId).NotNull();
            RuleFor(x => x.Index).NotNull();
            RuleFor(x => x.Text).NotNull().NotEmpty();
        }
    }
}
