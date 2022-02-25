using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateQuestionCommand : IRequest<int>
    {
        public Guid QuestionId { get; set; }

        public Guid CourseId { get; set; }

        public int Index { get; set; }

        public string Text { get; set; }
    }
}
