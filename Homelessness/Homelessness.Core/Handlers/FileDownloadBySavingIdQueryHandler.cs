using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class FileDownloadBySavingIdQueryHandler : IRequestHandler<FileDownloadBySavingIdQuery, IEnumerable<Models.File>>
    {
        private readonly IFileRepository fileRepository;

        public FileDownloadBySavingIdQueryHandler(IFileRepository fileRepository)
        {
            Verify.NotNull(nameof(fileRepository), fileRepository);

            this.fileRepository = fileRepository;
        }

        public async Task<IEnumerable<Models.File>> Handle(FileDownloadBySavingIdQuery request, CancellationToken cancellationToken)
        {
            var filesQuery = await fileRepository.QueryAllReadOnlyAsync();
            var dbFiles = await filesQuery
                .Where(f => f.SavingId == request.SavingId)
                .ToListAsync();

            var files = dbFiles.Select(f => f.ToModel());

            return files;
        }
    }
}
