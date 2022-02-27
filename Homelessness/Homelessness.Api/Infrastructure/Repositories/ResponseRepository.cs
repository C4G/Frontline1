using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class ResponseRepository : Repository<Response>, IResponseRepository
    {
        public ResponseRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
