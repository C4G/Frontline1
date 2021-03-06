namespace Homelessness.Models
{
    public class Question
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public int Index { get; set; }

        public string Text { get; set; }

        public ICollection<Response> Responses { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
