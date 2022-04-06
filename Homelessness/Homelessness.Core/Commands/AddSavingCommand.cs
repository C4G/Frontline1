using Homelessness.Models;
using Homelessness.Models.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Homelessness.Core.Commands
{
    public class AddSavingCommand : IRequest<Saving>
    {
        public Guid UserId { get; set; }

        public double Value { get; set; }

        public SavingsTypes SavingsType { get; set; }

        public List<IFormFile> Files { get; set; }
    }
}
