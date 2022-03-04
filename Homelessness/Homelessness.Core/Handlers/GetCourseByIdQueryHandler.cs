using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
            var course = await courseRepository.GetSingleOrDefaultAsync(
                predicate: c => c.Id == request.CourseId, 
                include: i => i.Include(c => c.Questions)
                               .ThenInclude(q => q.Responses));

            if (course is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
            }

            return course.ToModel();
        }
    }
}
