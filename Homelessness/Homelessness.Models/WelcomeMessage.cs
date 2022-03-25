namespace Homelessness.Models
{
    public class WelcomeMessage
    {
        public Guid Id { get; set; }

        public string Message { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
