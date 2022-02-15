using Homelessness.Core.Models.Identity;
using System.Security.Claims;

namespace Homelessness.Core.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateJwtTokenAsync(ApplicationUser user);

        string GenerateRefreshToken();

        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
