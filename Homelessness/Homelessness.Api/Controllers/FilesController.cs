using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Homelessness.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly ILogger<FilesController> logger;

        public FilesController(IMediator mediator, ILogger<FilesController> logger)
        {
            Verify.NotNull(nameof(mediator), mediator);
            Verify.NotNull(nameof(logger), logger);

            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Post([FromForm] FileUploadCommand command)
        {
            try
            {
                var uploadResult = await mediator.Send(command);

                if (uploadResult is null)
                {
                    return BadRequest();
                }

                return Ok(uploadResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //[HttpGet("download")]
        //public async Task<IActionResult> DownloadFile(int id)
        //{
        //    var stream = await _fileUtilityService.DownloadFile(id);
        //    if (stream == null)
        //        return NotFound();
        //    return new FileContentResult(stream, "application/octet-stream");
        //}

        [HttpGet("download/{savingId}")]
        public async Task<IActionResult> DownloadFile(Guid savingId)
        {
            try
            {
                var query = new FileDownloadBySavingIdQuery(savingId);
                var filesResult = await mediator.Send(query);

                if (filesResult is null)
                {
                    return NotFound();
                }

                return Ok(filesResult);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateFileCommand command)
        {
            command.FileId = id;

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
