namespace Homelessness.Models.Responses
{
    public class UserDataResponse
    {
        public Guid Id { get; set; }

        public Guid? RoleId { get; set; }
        
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsApproved { get; set; }

        public List<UserCourse> UserCourses { get; set; } = new List<UserCourse>();

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
