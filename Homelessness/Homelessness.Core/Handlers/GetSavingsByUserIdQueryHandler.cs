using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetSavingsByUserIdQueryHandler : IRequestHandler<GetSavingsByUserIdQuery, IEnumerable<Saving>>
    {
        private readonly ISavingRepository savingRepository;

        public GetSavingsByUserIdQueryHandler(ISavingRepository savingRepository)
        {
            Verify.NotNull(nameof(savingRepository), savingRepository);

            this.savingRepository = savingRepository;
        }

        public async Task<IEnumerable<Saving>> Handle(GetSavingsByUserIdQuery request, CancellationToken cancellationToken)
        {
            var savingsQuery = await savingRepository.QueryAllReadOnlyAsync();
            var savings = await savingsQuery
                .Include(s => s.Files)
                .Where(s => s.ApplicationUserId == request.UserId)
                .ToListAsync();

            return savings.Select(s => s.ToModel());
        }
    }
}
