namespace Homelessness.Models
{
    public class File
    {
        public Guid Id { get; set; }

        public Guid SavingId { get; set; }

        public string Name { get; set; }

        public long Size { get; set; }

        public byte[] Content { get; set; }

        public bool IsValidated { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
