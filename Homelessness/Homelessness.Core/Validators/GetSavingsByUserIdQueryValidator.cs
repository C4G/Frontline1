using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class GetSavingsByUserIdQueryValidator : AbstractValidator<GetSavingsByUserIdQuery>
    {
        public GetSavingsByUserIdQueryValidator()
        {
            RuleFor(x => x.UserId).NotNull();
        }
    }
}
