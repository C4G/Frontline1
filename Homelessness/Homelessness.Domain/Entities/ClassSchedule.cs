using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class ClassSchedule : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        public DateTime ScheduledDate { get; set; }

        public string Description { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.ClassSchedule ToModel()
        {
            var classSchedule = new Models.ClassSchedule
            {
                Id = Id,
                ScheduledDate = ScheduledDate,
                Description = Description,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate,
            };

            return classSchedule;
        }
    }
}
