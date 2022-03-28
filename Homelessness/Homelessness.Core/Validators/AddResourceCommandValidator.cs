using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddResourceCommandValidator : AbstractValidator<AddResourceCommand>
    {
        public AddResourceCommandValidator()
        {
            RuleFor(x => x.CourseId).NotNull();
            RuleFor(x => x.Name).NotNull().NotEmpty();
            RuleFor(x => x.Link).NotNull().NotEmpty();
        }
    }
}
