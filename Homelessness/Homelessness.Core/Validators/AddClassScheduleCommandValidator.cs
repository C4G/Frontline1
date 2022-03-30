using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class AddClassScheduleCommandValidator : AbstractValidator<AddClassScheduleCommand>
    {
        public AddClassScheduleCommandValidator()
        {
            RuleFor(x => x.ScheduledDate)
                .NotNull()
                .GreaterThanOrEqualTo(DateTimeOffset.Now)
                .WithMessage("Date should be in the future.");
        }
    }
}
