using System.ComponentModel.DataAnnotations;

namespace Homelessness.Core.Models.Requests
{
    public class LoginEntity
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
