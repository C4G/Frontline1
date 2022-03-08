using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class AddSavingCommandHandler : IRequestHandler<AddSavingCommand, Saving>
    {
        private readonly ISavingRepository savingRepository;

        public AddSavingCommandHandler(ISavingRepository savingRepository)
        {
            Verify.NotNull(nameof(savingRepository), savingRepository);

            this.savingRepository = savingRepository;
        }

        public async Task<Saving> Handle(AddSavingCommand request, CancellationToken cancellationToken)
        {
            var savingId = Guid.NewGuid();
            var saving = new Domain.Entities.Saving
            {
                Id = savingId,
                ApplicationUserId = request.UserId,
                Amount = request.Amount,
                FicoScore = request.FicoScore
            };

            await savingRepository.AddAsync(saving);

            return saving.ToModel();
        }
    }
}
