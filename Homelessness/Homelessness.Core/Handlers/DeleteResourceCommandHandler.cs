using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class DeleteResourceCommandHandler : IRequestHandler<DeleteResourceCommand, int>
    {
        private readonly IResourceRepository resourceRepository;

        public DeleteResourceCommandHandler(IResourceRepository resourceRepository)
        {
            Verify.NotNull(nameof(resourceRepository), resourceRepository);

            this.resourceRepository = resourceRepository;
        }

        public async Task<int> Handle(DeleteResourceCommand request, CancellationToken cancellationToken)
        {
            var resource = await resourceRepository.GetSingleOrDefaultAsync(q => q.Id == request.ResourceId && q.CourseId == request.CourseId);

            if (resource is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Resource), request.ResourceId);
            }

            return await resourceRepository.DeleteAsync(resource);
        }
    }
}
