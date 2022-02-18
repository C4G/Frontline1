using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        public CourseRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
