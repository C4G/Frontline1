using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class SavingRepository : Repository<Saving>, ISavingRepository
    {
        public SavingRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
