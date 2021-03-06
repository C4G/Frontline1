using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Notifications;
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
        private readonly IMediator mediator;

        public AddUserCommandHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ITokenService tokenService, 
            IMediator mediator)
        {
            Verify.NotNull(nameof(userManager), userManager);
            Verify.NotNull(nameof(roleManager), roleManager);
            Verify.NotNull(nameof(tokenService), tokenService);
            Verify.NotNull(nameof(mediator), mediator);

            this.userManager = userManager;
            this.roleManager = roleManager;
            this.tokenService = tokenService;
            this.mediator = mediator;
        }

        public async Task<SignUpResponse> Handle(AddUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);

            if (existingUser is not null)
            {
                throw new EntityEntryAlreadyExistsException($"{nameof(ApplicationUser)} already exists.");
            }

            var roles = roleManager.Roles.ToList();

            var requestRoleName = roles.SingleOrDefault(r => r.Id == request.RoleId)?.Name;

            if (string.IsNullOrWhiteSpace(requestRoleName))
            {
                throw new EntityNotFoundException(nameof(ApplicationRole), request.RoleId);
            }

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email,
                RefreshToken = "",
                RoleId = request.RoleId,
                IsApproved = true,
                CreatedDate = DateTime.Now
            };

            if (request.UserName is not null)
            {
                user.UserName = request.UserName;
            }

            if (request.PhoneNumber is not null)
            {
                user.PhoneNumber = request.PhoneNumber;
            }

            var identityResult = await userManager.CreateAsync(user, request.Password);

            if (identityResult.Succeeded)
            {
                await userManager.AddToRoleAsync(user, requestRoleName);

                bool isRoleUser = requestRoleName == "User";
                if (isRoleUser)
                {
                    await mediator.Publish(new UserApprovedNotification { UserId = user.Id });
                }

                var authToken = await tokenService.GenerateJwtTokenAsync(user);

                var signupData = new SignUpResponse(authToken, user.UserName, user.Email, user.FirstName, user.LastName);

                return signupData;
            }

            throw new Exception(string.Join(",", identityResult.Errors?.Select(error => error.Description)));
        }
    }
}
