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
    public class ClassSchedulesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<ClassSchedulesController> logger;

        public ClassSchedulesController(IMediator mediator, ILogger<ClassSchedulesController> logger)
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
                var query = new GetClassScheduleQuery();
                var classScheduleResult = await mediator.Send(query);

                return Ok(classScheduleResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Post(AddClassScheduleCommand command)
        {
            try
            {
                var classScheduleResult = await mediator.Send(command);
                
                if (classScheduleResult is null)
                {
                    return BadRequest();
                }

                return Created(nameof(Post), classScheduleResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Put(Guid id, UpdateClassScheduleCommand command)
        {
            command.ClassScheduleId = id;

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
