using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetSavingsForAllUsersQueryHandler : IRequestHandler<GetSavingsForAllUsersQuery, IEnumerable<object>>
    {
        private readonly ISavingRepository savingRepository;

        public GetSavingsForAllUsersQueryHandler(ISavingRepository savingRepository)
        {
            Verify.NotNull(nameof(savingRepository), savingRepository);

            this.savingRepository = savingRepository;
        }

        public async Task<IEnumerable<object>> Handle(GetSavingsForAllUsersQuery request, CancellationToken cancellationToken)
        {
            var savingsQuery = await savingRepository.QueryAllReadOnlyAsync();
            var savings = await savingsQuery
                .Include(s => s.Files)
                .GroupBy(s => s.ApplicationUserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Savings = g.OrderByDescending(s => s.CreatedDate).Select(s => s.ToModel())
                }).ToListAsync();

            return savings;
        }
    }
}
