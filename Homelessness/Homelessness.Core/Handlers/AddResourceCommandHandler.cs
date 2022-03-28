using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class AddResourceCommandHandler : IRequestHandler<AddResourceCommand, Resource>
    {
        private readonly IResourceRepository resourceRepository;

        public AddResourceCommandHandler(IResourceRepository resourceRepository)
        {
            Verify.NotNull(nameof(resourceRepository), resourceRepository);

            this.resourceRepository = resourceRepository;
        }

        public async Task<Resource> Handle(AddResourceCommand request, CancellationToken cancellationToken)
        {
            var existingResource = await resourceRepository.GetFirstOrDefaultAsync(q => q.CourseId == request.CourseId && q.Name.ToLower() == request.Name.ToLower());

            if (existingResource is not null)
            {
                throw new EntityEntryAlreadyExistsException($"{nameof(Domain.Entities.Resource)} already exists.");
            }

            var resourceId = Guid.NewGuid();
            var resource = new Domain.Entities.Resource
            {
                Id = resourceId,
                CourseId = request.CourseId,
                Name = request.Name,
                Link = request.Link,
                Description = request.Description,
                IsActive = true,
            };

            await resourceRepository.AddAsync(resource);

            return resource.ToModel();
        }
    }
}
