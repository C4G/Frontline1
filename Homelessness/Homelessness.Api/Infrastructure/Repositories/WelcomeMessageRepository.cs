using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class WelcomeMessageRepository : Repository<WelcomeMessage>, IWelcomeMessageRepository
    {
        public WelcomeMessageRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
