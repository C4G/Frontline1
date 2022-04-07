using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, ICollection<object>>
    {
        private readonly ICourseRepository courseRepository;
        private readonly IUserRepository userRepository;
        private readonly IAuthService authService;

        private List<Domain.Entities.UserCourse> dbUserCourses = new();
        private List<Domain.Entities.Course> dbCoursesFromUser = new();

        public GetCoursesQueryHandler(ICourseRepository courseRepository, IUserRepository userRepository, IAuthService authService)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);
            Verify.NotNull(nameof(userRepository), userRepository);
            Verify.NotNull(nameof(authService), authService);

            this.courseRepository = courseRepository;
            this.userRepository = userRepository;
            this.authService = authService;
        }

        public async Task<ICollection<dynamic>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            var authUser = await authService.GetAuthenticatedUser();
            var dbUser = await userRepository
                .GetSingleOrDefaultAsync(
                    predicate: u => u.Id == authUser.Id, 
                    include: i => i.Include(u => u.UserCourses).ThenInclude(uc => uc.Course));
            dbUserCourses = dbUser.UserCourses.ToList();
            dbCoursesFromUser = dbUser.UserCourses.Select(uc => uc.Course).ToList();

            List<Course> courseList = new ();

            bool isAuthUserRoleUser = await authService.IsAuthenticatedUserUser();
            if (isAuthUserRoleUser)
            {
                courseList = dbCoursesFromUser
                    .Where(c => !c.IsDeleted)
                    .Select(c => c.ToModel())
                    .ToList();

                List<dynamic> userCourses = new List<dynamic>();
                foreach (var course in courseList)
                {
                    dynamic userCourse = new
                    {
                        Id = course.Id,
                        Index = course.Index,
                        Title = course.Title,
                        ContentLink = course.ContentLink,
                        IsEnabled = course.IsEnabled,
                        NextClassDate = course.NextClassDate,
                        IsCompleted = IsCourseCompletedByUser(dbUser.Id, course.Id),
                        CreatedDate = course.CreatedDate,
                        UpdatedDate = course.UpdatedDate
                    };

                    userCourses.Add(userCourse);
                }

                return userCourses;
            }
            else
            {
                var coursesQuery = await courseRepository.QueryAllReadOnlyAsync();
                var courses = await coursesQuery.Where(c => !c.IsDeleted).ToListAsync();
                courseList = courses.Select(c => c.ToModel()).ToList();

                List<dynamic> courseCollection = new List<dynamic>();

                foreach (var course in courseList)
                {
                    courseCollection.Add(new
                    {
                        Id = course.Id,
                        Index = course.Index,
                        Title = course.Title,
                        ContentLink = course.ContentLink,
                        IsEnabled = course.IsEnabled,
                        NextClassDate = course.NextClassDate,
                        CreatedDate = course.CreatedDate,
                        UpdatedDate = course.UpdatedDate
                    });
                }

                return courseCollection;
            }
        }

        private bool IsCourseCompletedByUser(Guid userId, Guid courseId)
        {
            return dbUserCourses.FirstOrDefault(uc => uc.UserId == userId && uc.CourseId == courseId).IsCompleted;
        }
    }
}
