using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities.Identity;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class UserRepository : Repository<ApplicationUser>, IUserRepository
    {
        public UserRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
