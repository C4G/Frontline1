using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateResourceCommandValidator : AbstractValidator<UpdateResourceCommand>
    {
        public UpdateResourceCommandValidator()
        {
            RuleFor(x => x.ResourceId).NotNull();
            RuleFor(x => x.CourseId).NotNull();
            RuleFor(x => x.Name).NotNull().NotEmpty();
            RuleFor(x => x.Link).NotNull().NotEmpty();
        }
    }
}
