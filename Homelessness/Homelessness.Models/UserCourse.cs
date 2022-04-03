namespace Homelessness.Models
{
    public class UserCourse
    {
        public Guid UserId { get; set; }

        public Guid CourseId { get; set; }

        public string CourseTitle { get; set; }

        public bool IsCompleted { get; set; }

        public List<Question> Questions { get; set; }
    }
}
