using Homelessness.Models.Identity;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetUsersQuery : IRequest<ICollection<ApplicationUser>>
    {
    }
}
