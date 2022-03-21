using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Notifications;
using Homelessness.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class BindCreatedCourseToUsersHandler : INotificationHandler<CourseCreatedNotification>
    {
        private readonly IUserRepository userRepository;
        private readonly IAuthService authService;

        public BindCreatedCourseToUsersHandler(IUserRepository userRepository, IAuthService authService)
        {
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(authService), authService);

            this.userRepository = userRepository;
            this.authService = authService;
        }

        public async Task Handle(CourseCreatedNotification notification, CancellationToken cancellationToken)
        {
            var userRole = authService.GetUserRole();

            var usersQuery = await userRepository.QueryAllAsync();
            var dbUsers = await usersQuery
                .Include(u => u.UserCourses)
                .Where(u => u.IsApproved && u.RoleId == userRole.Id)
                .ToListAsync();

            if (!dbUsers.Any())
            {
                return;
            }

            foreach (var user in dbUsers)
            {
                bool userCourseExists = user.UserCourses.FirstOrDefault(uc => uc.UserId == user.Id && uc.CourseId == notification.CourseId) is not null;

                if (userCourseExists) continue;

                UserCourse userCourse = new UserCourse
                {
                    UserId = user.Id,
                    CourseId = notification.CourseId,
                };

                user.UserCourses.Add(userCourse);
                await userRepository.UpdateAsync(user);
            }
        }
    }
}
