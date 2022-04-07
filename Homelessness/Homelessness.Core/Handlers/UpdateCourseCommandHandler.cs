using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand, int>
    {
        private readonly ICourseRepository courseRepository;

        public UpdateCourseCommandHandler(ICourseRepository courseRepository)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);

            this.courseRepository = courseRepository;
        }

        public async Task<int> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
        {
            var course = await courseRepository.GetAsync(request.CourseId);

            if (course is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Course), request.CourseId);
            }

            course.Index = request.Index;
            course.Title = request.Title;
            course.ContentLink = request.ContentLink;
            course.IsEnabled = request.IsEnabled;
            course.NextClassDate = request.NextClassDate;

            return await courseRepository.UpdateAsync(course);
        }
    }
}
