using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddQuestionCommand : IRequest<Question>
    {
        public Guid CourseId { get; set; }

        public int Index { get; set; }
        
        public string Text { get; set; }
    }
}
