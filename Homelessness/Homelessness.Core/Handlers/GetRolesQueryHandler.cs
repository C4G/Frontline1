using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Queries;
using Homelessness.Models.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Homelessness.Core.Handlers
{
    public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, ICollection<ApplicationRole>>
    {
        private readonly RoleManager<Domain.Entities.Identity.ApplicationRole> roleManager;

        public GetRolesQueryHandler(RoleManager<Domain.Entities.Identity.ApplicationRole> roleManager)
        {
            Verify.NotNull(nameof(roleManager), roleManager);

            this.roleManager = roleManager;
        }

        public async Task<ICollection<ApplicationRole>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        {
            var roles = roleManager.Roles.Select(r => r.ToModel()).ToList();

            return await Task.FromResult(roles);
        }
    }
}
