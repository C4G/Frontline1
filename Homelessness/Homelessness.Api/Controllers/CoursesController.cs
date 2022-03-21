using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Notifications;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<CoursesController> logger;

        public CoursesController(IMediator mediator, ILogger<CoursesController> logger)
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
                var query = new GetCoursesQuery();
                var coursesResult = await mediator.Send(query);

                return Ok(coursesResult);
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
                var courseResult = await mediator.Send(query);

                if (courseResult is null)
                {
                    return NotFound();
                }

                return Ok(courseResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(AddCourseCommand command)
        {
            try
            {
                var courseResult = await mediator.Send(command);

                if (courseResult is null)
                {
                    return BadRequest();
                }

                await mediator.Publish(new CourseCreatedNotification { CourseId = courseResult.Id });

                return CreatedAtAction(nameof(Get), new { id = courseResult.Id }, courseResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateCourseCommand command)
        {
            command.CourseId = id;

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
