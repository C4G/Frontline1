namespace Homelessness.Models
{
    public class ClassSchedule
    {
        public Guid Id { get; set; }

        public DateTimeOffset ScheduledDate { get; set; }

        public string Description { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
