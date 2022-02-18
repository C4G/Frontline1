using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddCourseCommand : IRequest<Course>
    {
        public int Index { get; set; }

        public string Title { get; set; }

        public string? ContentLink { get; set; }
    }
}
