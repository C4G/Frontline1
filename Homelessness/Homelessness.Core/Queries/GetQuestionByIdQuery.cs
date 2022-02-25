using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetQuestionByIdQuery : IRequest<Question>
    {
        public Guid QuestionId { get; set; }

        public GetQuestionByIdQuery(Guid questionId)
        {
            QuestionId = questionId;
        }
    }
}
