using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddResponseCommand : IRequest<Response>
    {
        public Guid QuestionId { get; set; }

        public string? Text { get; set; }
    }
}
