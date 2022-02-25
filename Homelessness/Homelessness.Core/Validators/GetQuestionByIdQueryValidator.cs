using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class GetQuestionByIdQueryValidator : AbstractValidator<GetQuestionByIdQuery>
    {
        public GetQuestionByIdQueryValidator()
        {
            RuleFor(x => x.QuestionId).NotNull();
        }
    }
}
