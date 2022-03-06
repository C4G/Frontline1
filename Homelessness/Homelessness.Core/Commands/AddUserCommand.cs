using Homelessness.Models.Responses;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddUserCommand : IRequest<SignUpResponse>
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
