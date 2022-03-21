using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class UserCourseRepository : Repository<UserCourse>, IUserCourseRepository
    {
        public UserCourseRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
