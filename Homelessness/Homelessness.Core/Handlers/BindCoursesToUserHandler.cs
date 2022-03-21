using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Notifications;
using Homelessness.Domain.Entities;
using Homelessness.Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class BindCoursesToUserHandler : INotificationHandler<UserApprovedNotification>
    {
        private readonly IUserRepository userRepository;
        private readonly ICourseRepository courseRepository;
        private readonly IUserCourseRepository userCourseRepository;

        public BindCoursesToUserHandler(IUserRepository userRepository, ICourseRepository courseRepository, IUserCourseRepository userCourseRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(courseRepository), courseRepository);
            Verify.NotNull(nameof(userCourseRepository), userCourseRepository);

            this.userRepository = userRepository;
            this.courseRepository = courseRepository;
            this.userCourseRepository = userCourseRepository;
        }

        public async Task Handle(UserApprovedNotification notification, CancellationToken cancellationToken)
        {
            var user = await GetUser(notification.UserId);
            var courses = await GetCourses();

            List<UserCourse> userCourses = new();

            foreach (var course in courses)
            {
                var existingUserCourse = user.UserCourses.FirstOrDefault(uc => uc.UserId == user.Id && uc.CourseId == course.Id);
                if (existingUserCourse is not null) continue;

                UserCourse userCourse = new UserCourse
                {
                    UserId = user.Id,
                    CourseId = course.Id
                };

                userCourses.Add(userCourse);
            }

            if (userCourses.Any())
            {
                userCourseRepository.AddRange(userCourses);
            }
        }

        private async Task<ApplicationUser> GetUser(Guid userId)
        {
            var user = await userRepository.GetSingleOrDefaultAsync(predicate: u => u.Id == userId, include: i => i.Include(u => u.UserCourses));

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(ApplicationUser), userId);
            }

            return user;
        }

        private async Task<List<Course>> GetCourses()
        {
            var coursesQuery = await courseRepository.QueryAllReadOnlyAsync();
            var courses = await coursesQuery.Where(c => c.IsEnabled).ToListAsync();

            return courses;
        }
    }
}
