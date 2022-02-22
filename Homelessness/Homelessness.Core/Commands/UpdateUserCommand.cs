using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateUserCommand : IRequest<int>
    {
        public Guid UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool IsApproved { get; set; }
    }
}
