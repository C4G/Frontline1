using Homelessness.Core.Interfaces.Repositories;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class FileRepository : Repository<Domain.Entities.File>, IFileRepository
    {
        public FileRepository(HomelessnessDbContext context) : base(context)
        {
        }
    }
}
