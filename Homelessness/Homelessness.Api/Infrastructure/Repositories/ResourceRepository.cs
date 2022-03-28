using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class ResourceRepository : Repository<Resource>, IResourceRepository
    {
        public ResourceRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
