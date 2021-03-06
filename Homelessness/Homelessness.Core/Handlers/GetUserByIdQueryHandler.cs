using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using Homelessness.Models.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDataResponse>
    {
        private readonly IUserRepository userRepository;

        public GetUserByIdQueryHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
        }

        public async Task<UserDataResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetSingleOrDefaultAsync(
                predicate: u => u.Id == request.UserId && u.IsApproved, 
                include: i => i.Include(u => u.UserCourses)
                               .ThenInclude(uc => uc.Course)
                               .ThenInclude(c => c.Questions)
                               .ThenInclude(q => q.Responses));

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Identity.ApplicationUser), request.UserId);
            }

            List<UserCourse> userCourses = new List<UserCourse>();
            var userCoursesNotDeleted = user.UserCourses.Where(uc => !uc.Course.IsDeleted);

            foreach (var dbUserCourse in userCoursesNotDeleted)
            {
                UserCourse userCourse = new UserCourse
                {
                    UserId = user.Id,
                    CourseId = dbUserCourse.CourseId,
                    CourseTitle = dbUserCourse.Course.Title,
                    CourseIndex = dbUserCourse.Course.Index,
                    IsCompleted = dbUserCourse.IsCompleted,
                    UpdatedDate = dbUserCourse.UpdatedDate,
                    Questions = dbUserCourse.Course.Questions.Select(q => q.ToModel()).ToList()
                };

                userCourses.Add(userCourse);
            }

            UserDataResponse userDataResponse = new UserDataResponse
            { 
                Id = user.Id,
                RoleId = user.RoleId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsApproved = user.IsApproved,
                UserCourses = userCourses,
                CreatedDate = user.CreatedDate,
                UpdatedDate = user.UpdatedDate
            };

            return userDataResponse;
        }
    }
}
