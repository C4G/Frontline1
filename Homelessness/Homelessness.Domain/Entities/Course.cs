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

        public bool IsDeleted { get; set; } = false;

        public DateTimeOffset CreatedDate { get; set ; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
        public virtual ICollection<Resource> Resources { get; set; } = new HashSet<Resource>();
        public virtual ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public virtual ICollection<UserCourse> UserCourses { get; set; } = new HashSet<UserCourse>();

        public Models.Course ToModel()
        {
            var course = new Models.Course
            {
                Id = Id,
                Index = Index,
                Title = Title,
                ContentLink = ContentLink,
                IsEnabled = IsEnabled,
                IsDeleted = IsDeleted,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            if (Questions.Any())
            {
                var questions = Questions.Select(q => q.ToModel()).ToList();
                course.Questions = questions;
            }

            if (Resources.Any())
            {
                var resources = Resources.Select(r => r.ToModel()).ToList();
                course.Resources = resources;
            }

            return course;
        }
    }
}
