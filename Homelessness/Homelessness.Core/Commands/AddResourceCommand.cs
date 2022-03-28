using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddResourceCommand : IRequest<Resource>
    {
        public Guid CourseId { get; set; }

        public string Name { get; set; }

        public string? Link { get; set; } = default;

        public string Description { get; set; }
    }
}
