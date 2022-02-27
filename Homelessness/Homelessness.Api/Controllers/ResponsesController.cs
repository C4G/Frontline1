using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ResponsesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<QuestionsController> logger;

        public ResponsesController(IMediator mediator, ILogger<QuestionsController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post(AddResponseCommand command)
        {
            try
            {
                var responseResult = await mediator.Send(command);

                if (responseResult is null)
                {
                    return BadRequest();
                }

                return Created(nameof(Post), responseResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
