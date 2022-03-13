using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetSavingsByUserIdQuery : IRequest<IEnumerable<Saving>>
    {
        public Guid UserId { get; set; }

        public GetSavingsByUserIdQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
