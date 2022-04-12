using Homelessness.Core.Commands;
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

        [HttpGet]
        [Authorize(Roles = "Administrator, Volunteer")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var query = new GetSavingsForAllUsersQuery();
                var savingsResult = await mediator.Send(query);

                return Ok(savingsResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(Guid userId)
        {
            try
            {
                var query = new GetSavingsByUserIdQuery(userId);
                var savingsResult = await mediator.Send(query);

                return Ok(savingsResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromForm] UpdateSavingCommand command)
        {
            command.SavingId = id;

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
