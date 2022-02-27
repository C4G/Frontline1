using Homelessness.Domain.Entities.Identity;

namespace Homelessness.Core.Interfaces
{
    public interface IAuthService
    {
        Task<ApplicationUser> GetAuthenticatedUser();
    }
}
