using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand, int>
    {
        private readonly ICourseRepository courseRepository;

        public DeleteCourseCommandHandler(ICourseRepository courseRepository)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);

            this.courseRepository = courseRepository;
        }

        public async Task<int> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
        {
            var course = await courseRepository.GetSingleOrDefaultAsync(q => q.Id == request.CourseId);

            if (course is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
            }

            course.IsDeleted = true;

            return await courseRepository.UpdateAsync(course);
        }
    }
}
