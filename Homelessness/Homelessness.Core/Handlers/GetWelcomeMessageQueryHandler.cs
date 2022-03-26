using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class GetWelcomeMessageQueryHandler : IRequestHandler<GetWelcomeMessageQuery, WelcomeMessage>
    {
        private readonly IWelcomeMessageRepository welcomeMessageRepository;

        public GetWelcomeMessageQueryHandler(IWelcomeMessageRepository welcomeMessageRepository)
        {
            Verify.NotNull(nameof(welcomeMessageRepository), welcomeMessageRepository);

            this.welcomeMessageRepository = welcomeMessageRepository;
        }

        public async Task<WelcomeMessage> Handle(GetWelcomeMessageQuery request, CancellationToken cancellationToken)
        {
            var welcomeMessage = await welcomeMessageRepository.GetSingleOrDefaultAsync();

            if (welcomeMessage is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.WelcomeMessage));
            }

            return welcomeMessage.ToModel();
        }
    }
}
