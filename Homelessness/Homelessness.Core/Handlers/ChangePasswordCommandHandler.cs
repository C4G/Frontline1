using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Handlers
{
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, int>
    {
        private readonly UserManager<ApplicationUser> userManager;

        public ChangePasswordCommandHandler(UserManager<ApplicationUser> userManager)
        {
            Verify.NotNull(nameof(userManager), userManager);
            
            this.userManager = userManager;
        }

        public async Task<int> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(request.UserId.ToString());

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(ApplicationUser), request.UserId);
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            IdentityResult result = await userManager.ResetPasswordAsync(user, token, request.Password);

            return result.Succeeded ? 1 : 0;
        }
    }
}
