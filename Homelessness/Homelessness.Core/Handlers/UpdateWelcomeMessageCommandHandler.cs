using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateWelcomeMessageCommandHandler : IRequestHandler<UpdateWelcomeMessageCommand, int>
    {
        private readonly IWelcomeMessageRepository welcomeMessageRepository;

        public UpdateWelcomeMessageCommandHandler(IWelcomeMessageRepository welcomeMessageRepository)
        {
            Verify.NotNull(nameof(welcomeMessageRepository), welcomeMessageRepository);

            this.welcomeMessageRepository = welcomeMessageRepository;
        }

        public async Task<int> Handle(UpdateWelcomeMessageCommand request, CancellationToken cancellationToken)
        {
            var welcomeMessage = await welcomeMessageRepository.GetSingleOrDefaultAsync();

            if (welcomeMessage is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.WelcomeMessage));
            }

            welcomeMessage.Message = request.Message;

            return await welcomeMessageRepository.UpdateAsync(welcomeMessage);
        }
    }
}
