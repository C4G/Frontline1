using Homelessness.Models.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Homelessness.Core.Commands
{
    public class UpdateSavingCommand : IRequest<int>
    {
        public Guid SavingId { get; set; }

        public double Value { get; set; }

        public SavingsTypes SavingsType { get; set; }

        public List<IFormFile> Files { get; set; } = new List<IFormFile>();
    }
}
