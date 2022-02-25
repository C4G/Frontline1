using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand>
    {
        public UpdateQuestionCommandValidator()
        {
            RuleFor(x => x.QuestionId).NotNull();
            RuleFor(x => x.CourseId).NotNull();
            RuleFor(x => x.Index).NotNull();
            RuleFor(x => x.Text).NotNull().NotEmpty();
        }
    }
}
