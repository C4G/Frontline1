using Homelessness.Models.Identity;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetUserByIdQuery : IRequest<ApplicationUser>
    {
        public Guid UserId { get; set; }


        public GetUserByIdQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
