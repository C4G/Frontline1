using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, object>
    {
        private readonly ICourseRepository courseRepository;
        private readonly IUserRepository userRepository;
        private readonly IAuthService authService;

        private List<Domain.Entities.UserCourse> dbUserCourses = new();
        private List<Domain.Entities.Course> dbCoursesFromUser = new();

        public GetCourseByIdQueryHandler(ICourseRepository courseRepository, IUserRepository userRepository, IAuthService authService)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(authService), authService);

            this.courseRepository = courseRepository;
            this.userRepository = userRepository;
            this.authService = authService;
        }

        public async Task<dynamic> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var authUser = await authService.GetAuthenticatedUser();
            var dbUser = await userRepository
                .GetSingleOrDefaultAsync(
                    predicate: u => u.Id == authUser.Id,
                    include: i => i.Include(u => u.UserCourses).ThenInclude(uc => uc.Course));
            dbUserCourses = dbUser.UserCourses.ToList();
            dbCoursesFromUser = dbUser.UserCourses.Select(uc => uc.Course).ToList();

            var dbCourse = await courseRepository.GetSingleOrDefaultAsync(
                    predicate: c => c.Id == request.CourseId,
                    include: i => i.Include(c => c.Questions)
                               .ThenInclude(q => q.Responses));

            if (dbCourse is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
            }

            dynamic courseResult = new
            {
                Id = dbCourse.Id,
                Index = dbCourse.Index,
                Title = dbCourse.Title,
                ContentLink = dbCourse.ContentLink,
                IsEnabled = dbCourse.IsEnabled,
                CreatedDate = dbCourse.CreatedDate,
                UpdatedDate = dbCourse.UpdatedDate
            };

            bool isAuthUserRoleUser = await authService.IsAuthenticatedUserUser();
            if (isAuthUserRoleUser)
            {
                var courseFromUserCourses = dbCoursesFromUser.FirstOrDefault(c => c.Id == request.CourseId);

                if (courseFromUserCourses is null)
                {
                    throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
                }

                return new
                {
                    Id = dbCourse.Id,
                    Index = dbCourse.Index,
                    Title = dbCourse.Title,
                    ContentLink = dbCourse.ContentLink,
                    IsEnabled = dbCourse.IsEnabled,
                    IsCompleted = IsCourseCompletedByUser(dbUser.Id, courseFromUserCourses.Id),
                    CreatedDate = dbCourse.CreatedDate,
                    UpdatedDate = dbCourse.UpdatedDate
                };
            }

            return courseResult;
        }

        private bool IsCourseCompletedByUser(Guid userId, Guid courseId)
        {
            return dbUserCourses.FirstOrDefault(uc => uc.UserId == userId && uc.CourseId == courseId).IsCompleted;
        }
    }
}
