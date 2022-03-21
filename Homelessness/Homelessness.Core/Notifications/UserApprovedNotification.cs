using MediatR;

namespace Homelessness.Core.Notifications
{
    public class UserApprovedNotification : INotification
    {
        public Guid UserId { get; set; }
    }
}
