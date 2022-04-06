using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Homelessness.Core.Handlers
{
    public class AddSavingCommandHandler : IRequestHandler<AddSavingCommand, Saving>
    {
        private readonly ISavingRepository savingRepository;
        const long invalidFileSize = 2097152; // 2 MB

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
                Value = request.Value,
                SavingsType = request.SavingsType
            };

            await AddFilesToSaving(saving, request.Files);

            await savingRepository.AddAsync(saving);

            return saving.ToModel();
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
