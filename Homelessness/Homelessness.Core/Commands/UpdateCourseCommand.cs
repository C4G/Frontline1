using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateCourseCommand : IRequest<int>
    {
        public Guid CourseId { get; set; }

        public int Index { get; set; }

        public string Title { get; set; }

        public string? ContentLink { get; set; }

        public bool IsEnabled { get; set; }

        public DateTimeOffset? NextClassDate { get; set; }
    }
}
