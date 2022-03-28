using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Administrator")]
    public class ResourcesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<ResourcesController> logger;

        public ResourcesController(IMediator mediator, ILogger<ResourcesController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post(AddResourceCommand command)
        {
            try
            {
                var resourceResult = await mediator.Send(command);

                if (resourceResult is null)
                {
                    return BadRequest();
                }

                return Created(nameof(Post), resourceResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateResourceCommand command)
        {
            command.ResourceId = id;

            try
            {
                return Ok(await mediator.Send(command));
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, DeleteResourceCommand command)
        {
            command.ResourceId = id;

            try
            {
                return Ok(await mediator.Send(command));
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
