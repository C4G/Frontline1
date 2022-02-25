using MediatR;

namespace Homelessness.Core.Commands
{
    public class DeleteQuestionCommand : IRequest<int>
    {
        public Guid QuestionId { get; set; }
        
        public Guid CourseId { get; set; }
    }
}
