using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Domain.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AuthService(UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            Verify.NotNull(nameof(userManager), userManager);
            Verify.NotNull(nameof(httpContextAccessor), httpContextAccessor);

            this.userManager = userManager;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<ApplicationUser> GetAuthenticatedUser()
        {
            var user = await userManager.GetUserAsync(httpContextAccessor.HttpContext.User);

            return user;
        }
    }
}
