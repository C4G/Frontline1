using Homelessness.Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class Course : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        public int Index { get; set; }

        [Required]
        public string Title { get; set; }

        public string? ContentLink { get; set; } = default;

        public bool IsEnabled { get; set; }

        public DateTimeOffset CreatedDate { get; set ; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
        public virtual ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();

        public Models.Course ToModel()
        {
            var course = new Models.Course
            {
                Id = Id,
                Index = Index,
                Title = Title,
                ContentLink = ContentLink,
                IsEnabled = IsEnabled,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return course;
        }
    }
}
