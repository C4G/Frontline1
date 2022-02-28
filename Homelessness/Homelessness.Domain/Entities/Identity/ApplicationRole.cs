using Microsoft.AspNetCore.Identity;

namespace Homelessness.Domain.Entities.Identity
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public Models.Identity.ApplicationRole ToModel()
        {
            var role = new Models.Identity.ApplicationRole()
            {
                Id = Id,
                Name = Name,
            };

            return role;
        }
    }
}
