using Microsoft.AspNetCore.Identity;

namespace Homelessness.Models.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public Guid Id { get; set; }

        public Guid? RoleId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsApproved { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
