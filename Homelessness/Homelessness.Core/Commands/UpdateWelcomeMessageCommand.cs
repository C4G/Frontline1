using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateWelcomeMessageCommand : IRequest<int>
    {
        public string Message { get; set; }
    }
}
