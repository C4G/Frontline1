using MediatR;

namespace Homelessness.Core.Commands
{
    public class DeleteResourceCommand : IRequest<int>
    {
        public Guid ResourceId { get; set; }

        public Guid CourseId { get; set; }
    }
}
