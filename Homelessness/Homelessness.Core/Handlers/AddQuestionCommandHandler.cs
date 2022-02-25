using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class AddQuestionCommandHandler : IRequestHandler<AddQuestionCommand, Question>
    {
        private readonly IQuestionRepository questionRepository;

        public AddQuestionCommandHandler(IQuestionRepository questionRepository)
        {
            Verify.NotNull(nameof(questionRepository), questionRepository);

            this.questionRepository = questionRepository;
        }

        public async Task<Question> Handle(AddQuestionCommand request, CancellationToken cancellationToken)
        {
            var existingQuestion = await questionRepository.GetFirstOrDefaultAsync(q => q.CourseId == request.CourseId && q.Text.ToLower() == request.Text.ToLower());

            if (existingQuestion is not null)
            {
                throw new EntityEntryAlreadyExistsException($"{nameof(Domain.Entities.Question)} already exists.");
            }

            var questionId = Guid.NewGuid();
            var question = new Domain.Entities.Question
            {
                Id = questionId,
                CourseId = request.CourseId,
                Index = request.Index,
                Text = request.Text
            };

            await questionRepository.AddAsync(question);

            return question.ToModel();
        }
    }
}
