using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class DeleteResourceCommandValidator : AbstractValidator<DeleteResourceCommand>
    {
        public DeleteResourceCommandValidator()
        {
            RuleFor(x => x.ResourceId).NotNull();
            RuleFor(x => x.CourseId).NotNull();
        }
    }
}
