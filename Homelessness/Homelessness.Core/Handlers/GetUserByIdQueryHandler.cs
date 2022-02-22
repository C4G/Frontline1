using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models.Identity;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, ApplicationUser>
    {
        private readonly IUserRepository userRepository;

        public GetUserByIdQueryHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
        }

        public async Task<ApplicationUser> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetAsync(request.UserId);

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Identity.ApplicationUser), request.UserId);
            }

            return user.ToModel();
        }
    }
}
