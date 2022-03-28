using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateResourceCommand : IRequest<int>
    {
        public Guid ResourceId { get; set; }

        public Guid CourseId { get; set; }

        public string Name { get; set; }

        public string Link { get; set; }

        public string Description { get; set; }

        public bool IsActive { get; set; }
    }
}
