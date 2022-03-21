using Homelessness.Domain.Entities.Identity;

namespace Homelessness.Core.Interfaces
{
    public interface IAuthService
    {
        Task<ApplicationUser> GetAuthenticatedUser();

        Task<bool> IsAuthenticatedUserAdmin();

        Task<bool> IsAuthenticatedUserUser();

        Task<bool> IsUserRoleUser(Guid userId);
    }
}
