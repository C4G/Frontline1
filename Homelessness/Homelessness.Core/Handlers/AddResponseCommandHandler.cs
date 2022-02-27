using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Domain.Entities.Identity;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class AddResponseCommandHandler : IRequestHandler<AddResponseCommand, Response>
    {
        private readonly IResponseRepository responseRepository;
        private readonly IAuthService authService;

        public AddResponseCommandHandler(
            IResponseRepository responseRepository,
            IAuthService authService)
        {
            Verify.NotNull(nameof(responseRepository), responseRepository);
            Verify.NotNull(nameof(authService), authService);

            this.responseRepository = responseRepository;
            this.authService = authService;
        }

        public async Task<Response> Handle(AddResponseCommand request, CancellationToken cancellationToken)
        {
            var existingResponse = await responseRepository.GetFirstOrDefaultAsync(r => r.QuestionId == request.QuestionId && r.Text.ToLower() == request.Text.ToLower());

            if (existingResponse is not null)
            {
                throw new EntityEntryAlreadyExistsException($"{nameof(Domain.Entities.Response)} already exists.");
            }

            var responseId = Guid.NewGuid();
            var userId = (await GetAuthenticatedUser()).Id;
            var response = new Domain.Entities.Response
            {
                Id = responseId,
                QuestionId = request.QuestionId,
                ApplicationUserId = userId,
                Text = request.Text
            };

            await responseRepository.AddAsync(response);

            return response.ToModel();
        }

        private async Task<ApplicationUser> GetAuthenticatedUser()
        {
            var user = await authService.GetAuthenticatedUser();

            return user;
        }
    }
}
