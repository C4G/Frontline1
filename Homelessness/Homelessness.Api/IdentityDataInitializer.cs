using Homelessness.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Api
{
    public static class IdentityDataInitializer
    {
        public static void SeedData(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager);
        }

        public static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            if (userManager.FindByEmailAsync("admin@test.com").Result is null)
            {
                ApplicationUser user = new ApplicationUser();
                user.UserName = "admin@test.com";
                user.Email = "admin@test.com";
                user.FirstName = "Johnny";
                user.LastName = "Terrory";
                user.RefreshToken = "";
                user.IsApproved = true;

                var password = "Test1234!";
                IdentityResult result = userManager.CreateAsync(user, password).Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "Administrator").Wait();
                }
            }
        }

        public static void SeedRoles(RoleManager<ApplicationRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync("User").Result)
            {
                ApplicationRole role = new ApplicationRole();
                role.Name = "User";
                IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync("Administrator").Result)
            {
                ApplicationRole role = new ApplicationRole();
                role.Name = "Administrator";
                IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            }
        }
    }
}
