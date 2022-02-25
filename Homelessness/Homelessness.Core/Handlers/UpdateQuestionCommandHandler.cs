using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, int>
    {
        private readonly IQuestionRepository questionRepository;

        public UpdateQuestionCommandHandler(IQuestionRepository questionRepository)
        {
            Verify.NotNull(nameof(questionRepository), questionRepository);

            this.questionRepository = questionRepository;
        }

        public async Task<int> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
        {
            var question = await questionRepository.GetFirstOrDefaultAsync(q => q.Id == request.QuestionId && q.CourseId == request.CourseId);

            if (question is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Question), $"QuestionId: {request.QuestionId} - CourseId: {request.CourseId}");
            }

            question.Index = request.Index;
            question.Text = request.Text;

            return await questionRepository.UpdateAsync(question);
        }
    }
}
