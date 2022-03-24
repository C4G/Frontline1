using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateUserCourseCommandHandler : IRequestHandler<UpdateUserCourseCommand, int>
    {
        private readonly IUserCourseRepository userCourseRepository;

        public UpdateUserCourseCommandHandler(IUserCourseRepository userCourseRepository)
        {
            Verify.NotNull(nameof(userCourseRepository), userCourseRepository);

            this.userCourseRepository = userCourseRepository;
        }

        public async Task<int> Handle(UpdateUserCourseCommand request, CancellationToken cancellationToken)
        {
            var userCourse = await userCourseRepository.GetSingleOrDefaultAsync(uc => uc.UserId == request.UserId && uc.CourseId == request.CourseId);

            if (userCourse is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.UserCourse));
            }

            userCourse.IsCompleted = request.IsCompleted;

            return await userCourseRepository.UpdateAsync(userCourse);
        }
    }
}
