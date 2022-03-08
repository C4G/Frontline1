using MediatR;
using Microsoft.AspNetCore.Http;

namespace Homelessness.Core.Commands
{
    public class FileUploadCommand : IRequest<IEnumerable<Models.File>>
    {
        public Guid SavingId { get; set; }

        public List<IFormFile> Files { get; set; }
    }
}
