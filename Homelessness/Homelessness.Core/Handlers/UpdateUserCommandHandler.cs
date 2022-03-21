using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Notifications;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, int>
    {
        private readonly IUserRepository userRepository;
        private readonly IAuthService authService;
        private readonly IMediator mediator;

        public UpdateUserCommandHandler(IUserRepository userRepository, IAuthService authService, IMediator mediator)
        {
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(mediator), mediator);

            this.userRepository = userRepository;
            this.authService = authService;
            this.mediator = mediator;
        }

        public async Task<int> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetAsync(request.UserId);

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Identity.ApplicationUser), request.UserId);
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.IsApproved = request.IsApproved;

            var updateResult = await userRepository.UpdateAsync(user);

            bool isUserRoleUser = await authService.IsUserRoleUser(user.Id);
            if (user.IsApproved && isUserRoleUser)
            {
                await mediator.Publish(new UserApprovedNotification { UserId = user.Id });
            }

            return updateResult;
        }
    }
}
