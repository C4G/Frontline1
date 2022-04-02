using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class DeleteCourseCommandValidator : AbstractValidator<DeleteCourseCommand>
    {
        public DeleteCourseCommandValidator()
        {
            RuleFor(x => x.CourseId).NotNull();
        }
    }
}
