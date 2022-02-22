using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class UserBulkEditCommandHandler : IRequestHandler<UserBulkEditCommand, Unit>
    {
        private readonly IUserRepository userRepository;

        public UserBulkEditCommandHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
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
                    u.FirstName = requestUser.FirstName;
                    u.LastName = requestUser.LastName;
                    u.IsApproved = requestUser.IsApproved;

                    return u;
                }).ToList();

            if (updatedUserList.Any())
            {
                userRepository.UpdateRange(updatedUserList);
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
