using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class RegistrationField
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string DisplayName { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public Models.RegistrationField ToModel()
        {
            var field = new Models.RegistrationField
            {
                Id = Id,
                Name = Name,
                DisplayName = DisplayName,
                Description = Description,
                IsActive = IsActive
            };

            return field;
        }
    }
}
