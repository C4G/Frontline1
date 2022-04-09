using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class NextClassesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<NextClassesController> logger;

        public NextClassesController(IMediator mediator, ILogger<NextClassesController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(Guid userId)
        {
            try
            {
                var query = new GetNextClassByUserIdQuery(userId);
                var nextClassResult = await mediator.Send(query);

                if (nextClassResult is null)
                {
                    return NotFound();
                }

                return Ok(nextClassResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
