using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class GetNextClassByUserIdQueryValidator : AbstractValidator<GetNextClassByUserIdQuery>
    {
        public GetNextClassByUserIdQueryValidator()
        {
            RuleFor(x => x.UserId).NotNull();
        }
    }
}
