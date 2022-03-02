namespace Homelessness.Models
{
    public class Saving
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public double Amount { get; set; }

        public int FicoScore { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
