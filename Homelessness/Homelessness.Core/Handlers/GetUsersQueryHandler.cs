using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, ICollection<ApplicationUser>>
    {
        private readonly IUserRepository userRepository;

        public GetUsersQueryHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
        }

        public async Task<ICollection<ApplicationUser>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            var usersQuery = await userRepository.QueryAllReadOnlyAsync();
            var users = await usersQuery.ToListAsync();
            var userList = users.Select(u => u.ToModel()).ToList();

            return userList;
        }
    }
}
