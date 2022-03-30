using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class ClassScheduleRepository : Repository<ClassSchedule>, IClassScheduleRepository
    {
        public ClassScheduleRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
