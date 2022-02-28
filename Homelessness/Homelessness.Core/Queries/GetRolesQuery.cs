using Homelessness.Models.Identity;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetRolesQuery : IRequest<ICollection<ApplicationRole>>
    {
    }
}
