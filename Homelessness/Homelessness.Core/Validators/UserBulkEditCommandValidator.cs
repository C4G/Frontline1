using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class UserBulkEditCommandValidator : AbstractValidator<UserBulkEditCommand>
    {
        public UserBulkEditCommandValidator()
        {
            RuleFor(x => x.UserCollection).NotNull().NotEmpty();
        }
    }
}
