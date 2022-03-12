using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class SavingsController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<SavingsController> logger;

        public SavingsController(IMediator mediator, ILogger<SavingsController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] AddSavingCommand command)
        {
            try
            {
                var savingResult = await mediator.Send(command);

                if (savingResult is null)
                {
                    return BadRequest();
                }

                return Created(nameof(Post), savingResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
