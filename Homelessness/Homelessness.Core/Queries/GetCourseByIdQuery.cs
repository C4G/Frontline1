using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetCourseByIdQuery : IRequest<object>
    {
        public Guid CourseId { get; set; }


        public GetCourseByIdQuery(Guid courseId)
        {
            CourseId = courseId;
        }
    }
}
