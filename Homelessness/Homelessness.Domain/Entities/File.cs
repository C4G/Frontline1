using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class File : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }
        
        [ForeignKey(nameof(Saving))]
        public Guid SavingId { get; set; }
        public virtual Saving Saving { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public long Size { get; set; }

        [Required]
        public byte[] Content { get; set; }

        public bool IsValidated { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.File ToModel()
        {
            var file = new Models.File
            { 
                Id = Id,
                SavingId = SavingId,
                Name = Name,
                Size = Size,
                Content = Content,
                IsValidated = IsValidated,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return file;
        }
    }
}
