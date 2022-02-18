using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, Course>
    {
        private readonly ICourseRepository courseRepository;

        public GetCourseByIdQueryHandler(ICourseRepository courseRepository)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);

            this.courseRepository = courseRepository;
        }

        public async Task<Course> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var course = await courseRepository.GetAsync(request.CourseId);

            if (course is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
            }

            return course.ToModel();
        }
    }
}
