using Homelessness.Models.Enums;

namespace Homelessness.Models
{
    public class Saving
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public double Value { get; set; }

        public SavingsTypes SavingsType { get; set; }

        public virtual ICollection<File> Files { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
