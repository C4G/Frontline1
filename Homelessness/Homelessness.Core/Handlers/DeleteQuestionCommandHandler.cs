using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommand, int>
    {
        private readonly IQuestionRepository questionRepository;

        public DeleteQuestionCommandHandler(IQuestionRepository questionRepository)
        {
            Verify.NotNull(nameof(questionRepository), questionRepository);

            this.questionRepository = questionRepository;
        }

        public async Task<int> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
        {
            var question = await questionRepository.GetSingleOrDefaultAsync(q => q.Id == request.QuestionId && q.CourseId == request.CourseId);

            if (question is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Question), request.QuestionId);
            }

            return await questionRepository.DeleteAsync(question);
        }
    }
}
