using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateResourceCommandHandler : IRequestHandler<UpdateResourceCommand, int>
    {
        private readonly IResourceRepository resourceRepository;

        public UpdateResourceCommandHandler(IResourceRepository resourceRepository)
        {
            Verify.NotNull(nameof(resourceRepository), resourceRepository);

            this.resourceRepository = resourceRepository;
        }

        public async Task<int> Handle(UpdateResourceCommand request, CancellationToken cancellationToken)
        {
            var resource = await resourceRepository.GetFirstOrDefaultAsync(q => q.Id == request.ResourceId && q.CourseId == request.CourseId);

            if (resource is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Resource), $"ResourceId: {request.ResourceId} - CourseId: {request.CourseId}");
            }

            resource.Name = request.Name;
            resource.Link = request.Link;
            resource.Description = request.Description;
            resource.IsActive = request.IsActive;

            return await resourceRepository.UpdateAsync(resource);
        }
    }
}
