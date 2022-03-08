﻿using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Domain.Entities.Identity;
using Homelessness.Models.Responses;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Handlers
{
    public class AddUserCommandHandler : IRequestHandler<AddUserCommand, SignUpResponse>
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly ITokenService tokenService;

        public AddUserCommandHandler(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, ITokenService tokenService)
        {
            Verify.NotNull(nameof(userManager), userManager);
            Verify.NotNull(nameof(roleManager), roleManager);
            Verify.NotNull(nameof(tokenService), tokenService);

            this.userManager = userManager;
            this.roleManager = roleManager;
            this.tokenService = tokenService;
        }

        public async Task<SignUpResponse> Handle(AddUserCommand request, CancellationToken cancellationToken)
        {
            var roles = roleManager.Roles.ToList();

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email,
                RefreshToken = "",
                RoleId = roles.SingleOrDefault(r => r.Name.Equals("User")).Id,
                IsApproved = true,
                CreatedDate = DateTime.Now
            };

            var identityResult = await userManager.CreateAsync(user, request.Password);

            if (identityResult.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "User"); // Assigning User role by default

                var authToken = await tokenService.GenerateJwtTokenAsync(user);

                var signupData = new SignUpResponse(authToken, user.UserName, user.Email, user.FirstName, user.LastName);

                return signupData;
            }

            throw new Exception(string.Join(",", identityResult.Errors?.Select(error => error.Description)));
        }
    }
}