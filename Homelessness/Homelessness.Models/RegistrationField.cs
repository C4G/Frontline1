namespace Homelessness.Models
{
    public class RegistrationField
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
