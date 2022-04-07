using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class AddCourseCommandHandler : IRequestHandler<AddCourseCommand, Course>
    {
        private readonly ICourseRepository courseRepository;

        public AddCourseCommandHandler(ICourseRepository courseRepository)
        {
            Verify.NotNull(nameof(courseRepository), courseRepository);

            this.courseRepository = courseRepository;
        }

        public async Task<Course> Handle(AddCourseCommand request, CancellationToken cancellationToken)
        {
            var courseQuery = await courseRepository.QueryAllReadOnlyAsync();
            var existingCourse = await courseQuery.FirstOrDefaultAsync(c => c.Title.ToLower() == request.Title.ToLower());

            if (existingCourse is not null)
            {
                throw new EntityEntryAlreadyExistsException($"{nameof(Domain.Entities.Course)} already exists.");
            }

            var courseId = Guid.NewGuid();
            var course = new Domain.Entities.Course
            {
                Id = courseId,
                Index = request.Index,
                Title = request.Title,
                ContentLink = request.ContentLink,
                IsEnabled = true,
                NextClassDate = request.NextClassDate
            };

            await courseRepository.AddAsync(course);

            return course.ToModel();
        }
    }
}
