using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class Question : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [ForeignKey("Courses")]
        public Guid CourseId { get; set; }
        public virtual Course Course { get; set; }

        public int Index { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual ICollection<Response> Responses { get; set; } = new HashSet<Response>();

        public Models.Question ToModel()
        {
            var question = new Models.Question
            { 
                Id = Id,
                CourseId = CourseId,
                Index = Index,
                Text = Text,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate,
            };

            return question;
        }
    }
}
