using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities.Identity
{
    public class UserRole : IdentityUserRole<Guid>
    {
        [ForeignKey("ApplicationUser")]
        public Guid UserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ApplicationRole")]
        public Guid RoleId { get; set; }
        public virtual ApplicationRole ApplicationRole { get; set; }
    }
}
