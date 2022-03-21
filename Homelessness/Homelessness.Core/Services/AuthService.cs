using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IUserRepository userRepository;

        private readonly string ADMIN_ROLE_NAME = "Administrator";
        private readonly string USER_ROLE_NAME = "User";

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IHttpContextAccessor httpContextAccessor,
            IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userManager), userManager);
            Verify.NotNull(nameof(roleManager), roleManager);
            Verify.NotNull(nameof(httpContextAccessor), httpContextAccessor);
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userManager = userManager;
            this.roleManager = roleManager;
            this.httpContextAccessor = httpContextAccessor;
            this.userRepository = userRepository;
        }

        public async Task<ApplicationUser> GetAuthenticatedUser()
        {
            var user = await userManager.GetUserAsync(httpContextAccessor.HttpContext.User);

            return user;
        }

        public async Task<bool> IsAuthenticatedUserAdmin()
        {
            var user = await GetAuthenticatedUser();
            var adminRole = GetAdminRole();

            return user.RoleId == adminRole.Id;
        }

        public async Task<bool> IsAuthenticatedUserUser()
        {
            var user = await GetAuthenticatedUser();
            var userRole = GetUserRole();

            return user.RoleId == userRole.Id;
        }

        public async Task<bool> IsUserRoleUser(Guid userId)
        {
            var dbUser = await GetUserById(userId);
            var userRole = GetUserRole();

            return dbUser.RoleId == userRole.Id;
        }

        public async Task<ApplicationUser> GetUserById(Guid userId)
        {
            var dbUser = await userRepository.GetSingleOrDefaultAsync(u => u.Id == userId);

            return dbUser;
        }

        public ApplicationRole GetAdminRole()
        {
            var adminRole = roleManager.Roles
                .SingleOrDefault(r => r.Name.ToLower() == ADMIN_ROLE_NAME.ToLower());

            if (adminRole is null)
            {
                throw new EntityNotFoundException(nameof(ApplicationRole), ADMIN_ROLE_NAME.ToLower());
            }

            return adminRole;
        }

        public ApplicationRole GetUserRole()
        {
            var userRole = roleManager.Roles
                .SingleOrDefault(r => r.Name.ToLower() == USER_ROLE_NAME.ToLower());

            if (userRole is null)
            {
                throw new EntityNotFoundException(nameof(ApplicationUser), USER_ROLE_NAME.ToLower());
            }

            return userRole;
        }
    }
}
