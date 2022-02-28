using Homelessness.Core.Commands;
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
    public class UsersController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<UsersController> logger;

        public UsersController(IMediator mediator, ILogger<UsersController> logger)
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
                var query = new GetUsersQuery();
                var usersResult = await mediator.Send(query);

                return Ok(usersResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var query = new GetCourseByIdQuery(id);
                var userResult = await mediator.Send(query);

                if (userResult is null)
                {
                    return NotFound();
                }

                return Ok(userResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateUserCommand command)
        {
            command.UserId = id;

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

        [HttpPut]
        public async Task<IActionResult> Put(UserBulkEditCommand command)
        {
            try
            {
                await mediator.Send(command);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
