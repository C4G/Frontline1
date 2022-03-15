using MediatR;

namespace Homelessness.Core.Commands
{
    public class FileBulkEditCommand : IRequest<Unit>
    {
        public ICollection<Models.File> FileCollection { get; init; }
    }
}
