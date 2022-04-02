namespace Homelessness.Models
{
    public class Course
    {
        public Guid Id { get; set; }

        public int Index { get; set; }

        public string Title { get; set; }

        public string? ContentLink { get; set; } = default;

        public bool IsEnabled { get; set; }

        public bool IsDeleted { get; set; }

        public ICollection<Question> Questions { get; set; }
        public ICollection<Resource> Resources { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
