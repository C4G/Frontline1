using Homelessness.Domain.Entities.Identity;
using Homelessness.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class Saving : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [ForeignKey("Users")]
        public Guid ApplicationUserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        public double Value { get; set; }

        public SavingsTypes SavingsType { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual ICollection<File> Files { get; set; } = new HashSet<File>();

        public Models.Saving ToModel()
        {
            var saving = new Models.Saving()
            {
                Id = Id,
                UserId = ApplicationUserId,
                Value = Value,
                SavingsType = SavingsType,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            if (Files.Any())
            {
                saving.Files = Files.Select(f => f.ToModel()).ToList();
            }

            return saving;
        }
    }
}
