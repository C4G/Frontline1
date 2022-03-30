using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UpdateClassScheduleCommandValidator : AbstractValidator<UpdateClassScheduleCommand>
    {
        public UpdateClassScheduleCommandValidator()
        {
            RuleFor(x => x.ClassScheduleId).NotNull();

            RuleFor(x => x.ScheduledDate)
                .NotNull()
                .GreaterThanOrEqualTo(DateTimeOffset.Now)
                .WithMessage("Date should be in the future.");
        }
    }
}
