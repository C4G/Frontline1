using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, ICollection<Course>>
    {
        private readonly ICourseRepository courseRepository;

        public GetCoursesQueryHandler(ICourseRepository courseRepository)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);

            this.courseRepository = courseRepository;
        }

        public async Task<ICollection<Course>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            var coursesQuery = await courseRepository.QueryAllReadOnlyAsync();
            var courses = await coursesQuery.ToListAsync();
            var courseList = courses.Select(c => c.ToModel()).ToList();

            return courseList;
        }
    }
}
