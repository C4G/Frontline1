using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Domain.Entities.Identity;
using Homelessness.Models.Requests;
using Homelessness.Models.Responses;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;
        private readonly SignInManager<ApplicationUser> signInManager;

        private readonly ITokenService tokenService;

        public AccountsController(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService)
        {
            Verify.NotNull(nameof(userManager), userManager);
            Verify.NotNull(nameof(roleManager), roleManager);
            Verify.NotNull(nameof(signInManager), signInManager);
            Verify.NotNull(nameof(tokenService), tokenService);

            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("currentUserData")]
        public async Task<ActionResult> CurrentUserData()
        {
            var user = await userManager.GetUserAsync(User);
            var userData = new UserDataResponse
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };

            return Ok(userData);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login([FromBody] LoginEntity loginModel)
        {
            if (ModelState.IsValid)
            {
                var userEmail = await userManager.FindByEmailAsync(loginModel.Email);

                if (userEmail is null)
                {
                    return StatusCode((int)HttpStatusCode.Unauthorized, "Email is not registered");
                }

                var result = await signInManager.PasswordSignInAsync(loginModel.Email, loginModel.Password, false, false);

                if (result.Succeeded)
                {
                    var appUser = userManager.Users.SingleOrDefault(r => r.Email == loginModel.Email);

                    if (!appUser.IsApproved)
                    {
                        return StatusCode((int)HttpStatusCode.Unauthorized, "Profile not approved by an Administrator");
                    }

                    var authToken = await tokenService.GenerateJwtTokenAsync(appUser);

                    appUser.RefreshToken = tokenService.GenerateRefreshToken();
                    appUser.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
                    await userManager.UpdateAsync(appUser);

                    var rootData = new LoginResponse(authToken, appUser.RefreshToken, appUser.UserName, appUser.Email, appUser.FirstName, appUser.LastName);
                    return Ok(rootData);
                }

                return StatusCode((int)HttpStatusCode.Unauthorized, "Incorrect Password");
            }

            string errorMessage = string.Join(", ", ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
            return BadRequest(errorMessage ?? "Bad Request");
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterEntity registerModel)
        {
            if (ModelState.IsValid)
            {
                var roles = roleManager.Roles.ToList();

                var user = new ApplicationUser
                {
                    FirstName = registerModel.FirstName,
                    LastName = registerModel.LastName,
                    UserName = registerModel.Email,
                    Email = registerModel.Email,
                    RefreshToken = "",
                    RoleId = roles.SingleOrDefault(r => r.Name.Equals("User")).Id,
                    CreatedDate = DateTime.Now
                };

                var result = await userManager.CreateAsync(user, registerModel.Password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User"); // Assigning User role by default

                    var authToken = await tokenService.GenerateJwtTokenAsync(user);

                    var rootData = new SignUpResponse(authToken, user.UserName, user.Email, user.FirstName, user.LastName);
                    return Created(nameof(Register), rootData);
                }

                return Ok(string.Join(",", result.Errors?.Select(error => error.Description)));
            }

            string errorMessage = string.Join(", ", ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
            return BadRequest(errorMessage ?? "Bad Request");
        }
    }
}
