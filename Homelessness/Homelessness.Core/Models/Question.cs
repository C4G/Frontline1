namespace Homelessness.Core.Models
{
    public class Question
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public int Index { get; set; }

        public string Text { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
