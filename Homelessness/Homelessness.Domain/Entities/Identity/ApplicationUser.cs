using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homelessness.Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser<Guid>, IEntity
    {
        [ForeignKey("ApplicationRole")]
        public Guid? RoleId { get; set; }
        public virtual ApplicationRole ApplicationRole { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsApproved { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
        public virtual ICollection<Response> Responses { get; set; } = new HashSet<Response>();
        public virtual ICollection<UserCourse> UserCourses { get; set; } = new HashSet<UserCourse>();

        public Models.Identity.ApplicationUser ToModel()
        {
            var user = new Models.Identity.ApplicationUser
            {
                Id = Id,
                RoleId = RoleId,
                FirstName = FirstName,
                LastName = LastName,
                UserName = UserName,
                Email = Email,
                PhoneNumber = PhoneNumber,
                RefreshToken = RefreshToken,
                RefreshTokenExpiryTime = RefreshTokenExpiryTime,
                IsApproved = IsApproved,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate
            };

            return user;
        }
    }
}
