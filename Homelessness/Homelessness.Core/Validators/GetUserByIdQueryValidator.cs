using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
    {
        public GetUserByIdQueryValidator()
        {
            RuleFor(x => x.UserId).NotNull();
        }
    }
}
