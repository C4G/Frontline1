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
                predicate: u => u.Id == request.UserId, 
                include: i => i.Include(u => u.UserCourses)
                               .ThenInclude(uc => uc.Course));

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Identity.ApplicationUser), request.UserId);
            }

            List<UserCourse> userCourses = new List<UserCourse>();
            foreach (var dbUserCourse in user.UserCourses)
            {
                UserCourse userCourse = new UserCourse
                {
                    UserId = user.Id,
                    CourseId = dbUserCourse.CourseId,
                    CourseTitle = dbUserCourse.Course.Title,
                    IsCompleted = dbUserCourse.IsCompleted
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
                IsApproved = user.IsApproved,
                UserCourses = userCourses,
                CreatedDate = user.CreatedDate,
                UpdatedDate = user.UpdatedDate
            };

            return userDataResponse;
        }
    }
}
