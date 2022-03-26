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
    public class WelcomeMessagesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<WelcomeMessagesController> logger;

        public WelcomeMessagesController(IMediator mediator, ILogger<WelcomeMessagesController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdateWelcomeMessageCommand command)
        {
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
