using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateFileCommand : IRequest<int>
    {
        public Guid FileId { get; set; }

        public bool IsValidated { get; set; }
    }
}
