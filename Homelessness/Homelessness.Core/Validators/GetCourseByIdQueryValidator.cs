using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class GetCourseByIdQueryValidator : AbstractValidator<GetCourseByIdQuery>
    {
        public GetCourseByIdQueryValidator()
        {
            RuleFor(x => x.CourseId).NotNull();
        }
    }
}
