using MediatR;

namespace Homelessness.Core.Notifications
{
    public class CourseCreatedNotification : INotification
    {
        public Guid CourseId { get; set; }
    }
}
