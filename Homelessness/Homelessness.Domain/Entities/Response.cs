using Homelessness.Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class Response : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [ForeignKey("Questions")]
        public Guid QuestionId { get; set; }
        public virtual Question Question { get; set; }

        [ForeignKey("Users")]
        public Guid ApplicationUserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        public string? Text { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.Response ToModel()
        {
            var response = new Models.Response
            {
                Id = Id,
                QuestionId = QuestionId,
                UserId = ApplicationUserId,
                Text = Text,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate,
            };

            return response;
        }
    }
}
