using FluentValidation;
using MediatR;
using System.Text;
using System.Text.Json;

namespace Homelessness.Api.PipelineBehaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators, IHttpContextAccessor httpContextAccessor)
        {
            _validators = validators;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            /* Pre */
            var failures = _validators.Select(x => x.Validate(request))
                .SelectMany(x => x.Errors)
                .Where(x => x != null)
                .ToList();

            if (failures.Any())
            {
                //throw new ValidationException(failures);
                var errors = failures.Select(f => new
                {
                    f.PropertyName,
                    f.ErrorMessage
                });

                var errorText = JsonSerializer.Serialize(errors);
                HttpContext context = _httpContextAccessor.HttpContext;
                context.Response.StatusCode = 400;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(errorText, Encoding.UTF8);
            }

            /* Process */
            return await next();

            /* Post */
            // Nothing at the moment
        }
    }
}
