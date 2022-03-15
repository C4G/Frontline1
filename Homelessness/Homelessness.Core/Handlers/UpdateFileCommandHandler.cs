using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateFileCommandHandler : IRequestHandler<UpdateFileCommand, int>
    {
        private readonly IFileRepository fileRepository;

        public UpdateFileCommandHandler(IFileRepository fileRepository)
        {
            Verify.NotNull(nameof(fileRepository), fileRepository);

            this.fileRepository = fileRepository;
        }

        public async Task<int> Handle(UpdateFileCommand request, CancellationToken cancellationToken)
        {
            var file = await fileRepository.GetAsync(request.FileId);

            if (file is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.File), request.FileId);
            }

            file.IsValidated = request.IsValidated;

            return await fileRepository.UpdateAsync(file);
        }
    }
}
