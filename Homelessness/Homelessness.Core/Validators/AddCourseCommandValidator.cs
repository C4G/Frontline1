using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddCourseCommandValidator : AbstractValidator<AddCourseCommand>
    {
        public AddCourseCommandValidator()
        {
            RuleFor(x => x.Index).NotNull();
            RuleFor(x => x.Title).NotNull().NotEmpty();
            RuleFor(x => x.ContentLink).NotNull().NotEmpty();
        }
    }
}
