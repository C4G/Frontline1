using Homelessness.Core.Interfaces;
using Homelessness.Core.Models.Identity;
using Homelessness.Core.Models.Requests;
using Homelessness.Core.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TokenController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ITokenService tokenService;

        public TokenController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest tokenRequest)
        {
            if (tokenRequest is null)
            {
                return BadRequest(new AuthResponse { IsAuthSuccessful = false });
            }

            var principal = tokenService.GetPrincipalFromExpiredToken(tokenRequest.Token);
            var username = principal.Identity.Name;
            var user = await userManager.FindByEmailAsync(username);
            if (user == null || user.RefreshToken != tokenRequest.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest(new AuthResponse { IsAuthSuccessful = false });
            }

            var token = await tokenService.GenerateJwtTokenAsync(user);
            user.RefreshToken = tokenService.GenerateRefreshToken();
            await userManager.UpdateAsync(user);

            return Ok(new AuthResponse { AuthToken = token, RefreshToken = user.RefreshToken, IsAuthSuccessful = true });
        }
    }
}
