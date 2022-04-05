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
    public class UserCoursesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<UserCoursesController> logger;

        public UserCoursesController(IMediator mediator, ILogger<UserCoursesController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdateUserCourseCommand command)
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
