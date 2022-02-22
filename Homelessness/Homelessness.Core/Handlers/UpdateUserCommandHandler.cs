using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, int>
    {
        private readonly IUserRepository userRepository;

        public UpdateUserCommandHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
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

            return await userRepository.UpdateAsync(user);
        }
    }
}
