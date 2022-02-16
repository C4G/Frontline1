using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Models.Identity
{
    public class UserRole : IdentityUserRole<Guid>
    {
        public Guid UserId { get; set; }

        public Guid RoleId { get; set; }
    }
}
