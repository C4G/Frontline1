using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetCourseByIdQuery : IRequest<Course>
    {
        public Guid CourseId { get; set; }


        public GetCourseByIdQuery(Guid courseId)
        {
            CourseId = courseId;
        }
    }
}
