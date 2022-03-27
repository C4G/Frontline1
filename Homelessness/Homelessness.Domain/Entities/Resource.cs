using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class Resource : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Course))]
        public Guid CourseId { get; set; }
        public virtual Course Course { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Link { get; set; } = default;

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.Resource ToModel()
        {
            var resource = new Models.Resource
            {
                Id = Id,
                CourseId = CourseId,
                Name = Name,
                Link = Link,
                Description = Description,
                IsActive = IsActive,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return resource;
        }
    }
}
