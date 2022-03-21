using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Notifications;
using Homelessness.Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class UserBulkEditCommandHandler : IRequestHandler<UserBulkEditCommand, Unit>
    {
        private readonly IUserRepository userRepository;
        private readonly IAuthService authService;
        private readonly IMediator mediator;

        public UserBulkEditCommandHandler(IUserRepository userRepository, IAuthService authService, IMediator mediator)
        {
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(mediator), mediator);

            this.userRepository = userRepository;
            this.authService = authService;
            this.mediator = mediator;
        }

        public async Task<Unit> Handle(UserBulkEditCommand request, CancellationToken cancellationToken)
        {
            var currentUserList = await GetCurrentUserList();
            var requestUserIdList = request.UserCollection.Where(u => u?.Id is not null && u?.Id != default(Guid)).Select(u => u.Id).ToList();

            List<ApplicationUser> updatedUserList = currentUserList
                .Where(u => requestUserIdList.Contains(u.Id))
                .Select(u =>
                {
                    var requestUser = request.UserCollection.FirstOrDefault(x => x.Id == u.Id);

                    if (!string.IsNullOrWhiteSpace(requestUser.FirstName))
                    {
                        u.FirstName = requestUser.FirstName;
                    }

                    if (!string.IsNullOrWhiteSpace(requestUser.LastName))
                    {
                        u.LastName = requestUser.LastName;
                    }

                    u.IsApproved = requestUser.IsApproved;

                    return u;
                }).ToList();

            if (updatedUserList.Any())
            {
                userRepository.UpdateRange(updatedUserList);
            }

            foreach (var updatedUser in updatedUserList)
            {
                bool isUserRoleUser = await authService.IsUserRoleUser(updatedUser.Id);
                if (updatedUser.IsApproved && isUserRoleUser)
                {
                    await mediator.Publish(new UserApprovedNotification { UserId = updatedUser.Id });
                }
            }

            return Unit.Value;
        }

        private async Task<List<ApplicationUser>> GetCurrentUserList()
        {
            var userQuery = await userRepository.QueryAllReadOnlyAsync();
            var userList = await userQuery.ToListAsync();

            return userList;
        }
    }
}
