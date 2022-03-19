using Homelessness.Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class UserCourse : IEntity
    {
        [ForeignKey(nameof(ApplicationUser))]
        public Guid UserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        [ForeignKey(nameof(Course))]
        public Guid CourseId { get; set; }
        public virtual Course Course { get; set; }

        public bool IsCompleted { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
