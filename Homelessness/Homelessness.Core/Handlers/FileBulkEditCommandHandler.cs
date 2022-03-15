using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class FileBulkEditCommandHandler : IRequestHandler<FileBulkEditCommand, Unit>
    {
        private readonly IFileRepository fileRepository;

        public FileBulkEditCommandHandler(IFileRepository fileRepository)
        {
            Verify.NotNull(nameof(fileRepository), fileRepository);

            this.fileRepository = fileRepository;
        }

        public async Task<Unit> Handle(FileBulkEditCommand request, CancellationToken cancellationToken)
        {
            var currentFileList = await GetCurrentFileList();
            var requestFileIdList = request.FileCollection.Where(f => f?.Id is not null && f?.Id != default(Guid)).Select(f => f.Id).ToList();

            List<Domain.Entities.File> updatedFileList = currentFileList
                .Where(f => requestFileIdList.Contains(f.Id))
                .Select(f =>
                {
                    var requestFile = request.FileCollection.FirstOrDefault(x => x.Id == f.Id);

                    f.IsValidated = requestFile.IsValidated;

                    return f;
                }).ToList();

            if (updatedFileList.Any())
            {
                fileRepository.UpdateRange(updatedFileList);
            }

            return Unit.Value;
        }

        private async Task<List<Domain.Entities.File>> GetCurrentFileList()
        {
            var fileQuery = await fileRepository.QueryAllReadOnlyAsync();
            var fileList = await fileQuery.ToListAsync();

            return fileList;
        }
    }
}
