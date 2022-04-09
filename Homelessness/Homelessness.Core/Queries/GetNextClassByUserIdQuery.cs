using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetNextClassByUserIdQuery : IRequest<NextClass?>
    {
        public Guid UserId { get; set; }

        public GetNextClassByUserIdQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
