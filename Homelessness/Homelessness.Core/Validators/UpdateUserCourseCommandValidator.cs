using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateUserCourseCommandValidator : AbstractValidator<UpdateUserCourseCommand>
    {
        public UpdateUserCourseCommandValidator()
        {
            RuleFor(x => x.UserId).NotNull();
            RuleFor(x => x.CourseId).NotNull();
        }
    }
}
