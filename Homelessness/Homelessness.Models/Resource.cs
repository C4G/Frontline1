namespace Homelessness.Models
{
    public class Resource
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public string Name { get; set; }

        public string? Link { get; set; } = default;

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
