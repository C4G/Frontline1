using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities
{
    public class WelcomeMessage : IEntity
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Models.WelcomeMessage ToModel()
        {
            var welcomeMessage = new Models.WelcomeMessage
            {
                Id = Id,
                Message = Message,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return welcomeMessage;
        }
    }
}
