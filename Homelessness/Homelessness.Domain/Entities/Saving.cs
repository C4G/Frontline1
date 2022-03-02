using Homelessness.Domain.Entities.Identity;
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

        public double Amount { get; set; }

        public int FicoScore { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.Saving ToModel()
        {
            var saving = new Models.Saving()
            {
                Id = Id,
                UserId = ApplicationUserId,
                Amount = Amount,
                FicoScore = FicoScore,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return saving;
        }
    }
}
