using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class GetQuestionByIdQueryHandler : IRequestHandler<GetQuestionByIdQuery, Question>
    {
        private readonly IQuestionRepository questionRepository;

        public GetQuestionByIdQueryHandler(IQuestionRepository questionRepository)
        {
            Verify.NotNull(nameof(questionRepository), questionRepository);

            this.questionRepository = questionRepository;
        }

        public async Task<Question> Handle(GetQuestionByIdQuery request, CancellationToken cancellationToken)
        {
            var question = await questionRepository.GetSingleOrDefaultAsync(q => q.Id == request.QuestionId);

            if (question is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Question), request.QuestionId);
            }

            return question.ToModel();
        }
    }
}
