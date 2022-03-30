using MediatR;

namespace Homelessness.Core.Commands
{
    public class UpdateClassScheduleCommand : IRequest<int>
    {
        public Guid ClassScheduleId { get; set; }

        public DateTimeOffset ScheduledDate { get; set; }

        public string Description { get; set; }
    }
}
