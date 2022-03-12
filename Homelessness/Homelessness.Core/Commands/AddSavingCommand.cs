using Homelessness.Models;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Homelessness.Core.Commands
{
    public class AddSavingCommand : IRequest<Saving>
    {
        public Guid UserId { get; set; }

        public double Amount { get; set; }

        public int FicoScore { get; set; }

        public List<IFormFile> Files { get; set; }
    }
}
