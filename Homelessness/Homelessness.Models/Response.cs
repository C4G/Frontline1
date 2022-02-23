namespace Homelessness.Models
{
    public class Response
    {
        public Guid Id { get; set; }

        public Guid QuestionId { get; set; }

        public Guid UserId { get; set; }

        public string? Text { get; set; }

        public bool IsResponded => !string.IsNullOrWhiteSpace(Text);

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
