using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class FileUploadCommandHandler : IRequestHandler<FileUploadCommand, IEnumerable<Models.File>>
    {
        private readonly IFileRepository fileRepository;
        const long invalidFileSize = 2097152; // 2 MB

        public FileUploadCommandHandler(IFileRepository fileRepository)
        {
            Verify.NotNull(nameof(fileRepository), fileRepository);

            this.fileRepository = fileRepository;
        }

        public async Task<IEnumerable<Models.File>> Handle(FileUploadCommand request, CancellationToken cancellationToken)
        {
            long globalSize = request.Files.Sum(f => f.Length);
            List<Models.File> uploadedFiles = new List<Models.File>();

            try
            {
                foreach (var f in request.Files)
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
                                    SavingId = request.SavingId,
                                    Name = Path.GetFileName(f.FileName),
                                    Size = memoryStream.Length,
                                    Content = memoryStream.ToArray()
                                };

                                await fileRepository.AddAsync(file);

                                uploadedFiles.Add(file.ToModel());
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
                throw new Exception("There was a problem uploading files", ex.InnerException);
            }

            return uploadedFiles;
        }
    }
}
