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

        [Authorize(Roles = "Administrator, Volunteer")]
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

        [Authorize(Roles = "Administrator, Volunteer")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var query = new GetUserByIdQuery(id);
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

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<IActionResult> Post(AddUserCommand command)
        {
            try
            {
                var userResult = await mediator.Send(command);

                if (userResult is null)
                {
                    return BadRequest();
                }

                return Created(nameof(Post), userResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Administrator")]
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

        [Authorize(Roles = "Administrator")]
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
