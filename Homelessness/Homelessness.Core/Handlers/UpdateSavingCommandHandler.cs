using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class UpdateSavingCommandHandler : IRequestHandler<UpdateSavingCommand, int>
    {
        private readonly ISavingRepository savingRepository;
        private readonly IFileRepository fileRepository;

        const long invalidFileSize = 2097152; // 2 MB

        public UpdateSavingCommandHandler(ISavingRepository savingRepository, IFileRepository fileRepository)
        {
            Verify.NotNull(nameof(savingRepository), savingRepository);
            Verify.NotNull(nameof(fileRepository), fileRepository);

            this.savingRepository = savingRepository;
            this.fileRepository = fileRepository;
        }

        public async Task<int> Handle(UpdateSavingCommand request, CancellationToken cancellationToken)
        {
            var saving = await savingRepository.GetSingleOrDefaultAsync(
                predicate: s => s.Id == request.SavingId, 
                include: i => i.Include(s => s.Files));

            if (saving is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Saving), request.SavingId);
            }

            saving.Value = request.Value;
            saving.SavingsType = request.SavingsType;

            if (request.Files.Any())
            {
                if (saving.Files.Any())
                {
                    DeleteFilesFromSaving(saving.Files);
                }

                await AddFilesToSaving(saving, request.Files);
            }

            return await savingRepository.UpdateAsync(saving);
        }

        private void DeleteFilesFromSaving(ICollection<Domain.Entities.File> files)
        {
            if (files.Any())
            {
                fileRepository.DeleteAll(files);
            }
        }

        private async Task AddFilesToSaving(Domain.Entities.Saving saving, List<IFormFile> files)
        {
            try
            {
                foreach (var f in files)
                {
                    if (f.Length > 0)
                    {
                        var memoryStream = new MemoryStream();

                        try
                        {
                            await f.CopyToAsync(memoryStream);

                            if (memoryStream.Length < invalidFileSize)
                            {
                                Guid fileId = Guid.NewGuid();
                                var file = new Domain.Entities.File
                                {
                                    Id = fileId,
                                    SavingId = saving.Id,
                                    Name = Path.GetFileName(f.FileName),
                                    Size = memoryStream.Length,
                                    Content = memoryStream.ToArray(),
                                    CreatedDate = DateTimeOffset.Now,
                                };

                                saving.Files.Add(file);
                            }
                            else
                            {
                                throw new Exception($"File {f.FileName} is too big");
                            }
                        }
                        finally
                        {
                            memoryStream.Close();
                            memoryStream.Dispose();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("There was a problem adding files to the savings record", ex.InnerException);
            }
        }
    }
}
