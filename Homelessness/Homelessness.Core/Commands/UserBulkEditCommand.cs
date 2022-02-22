using Homelessness.Models.Identity;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class UserBulkEditCommand : IRequest<Unit>
    {
        public ICollection<ApplicationUser> UserCollection { get; set; }
    }
}
