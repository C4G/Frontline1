using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Commands
{
    public class AddClassScheduleCommand : IRequest<ClassSchedule>
    {
        public DateTimeOffset ScheduledDate { get; set; }

        public string Description { get; set; }
    }
}
