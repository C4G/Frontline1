using MediatR;

namespace Homelessness.Core.Queries
{
    public class FileDownloadBySavingIdQuery : IRequest<IEnumerable<Models.File>>
    {
        public Guid SavingId { get; set; }


        public FileDownloadBySavingIdQuery(Guid savingId)
        {
            SavingId = savingId;
        }
    }
}
