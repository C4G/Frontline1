using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateUserCourseCommand : IRequest<int>
    {
        public Guid UserId { get; set; }

        public Guid CourseId { get; set; }

        public bool IsCompleted { get; set; }
    }
}
