using MediatR;

namespace Homelessness.Core.Commands
{
    public class DeleteCourseCommand : IRequest<int>
    {
        public Guid CourseId { get; set; }
    }
}
