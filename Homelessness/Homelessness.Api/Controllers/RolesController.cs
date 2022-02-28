using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [Authorize(Roles = "Administrator")]
    [ApiController]
    [Route("[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<UsersController> logger;

        public RolesController(IMediator mediator, ILogger<UsersController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var query = new GetRolesQuery();
                var rolesResult = await mediator.Send(query);

                return Ok(rolesResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
