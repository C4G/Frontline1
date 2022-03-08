using FluentValidation;
using Homelessness.Core.Queries;

namespace Homelessness.Core.Validators
{
    public class FileDownloadBySavingIdQueryValidator : AbstractValidator<FileDownloadBySavingIdQuery>
    {
        public FileDownloadBySavingIdQueryValidator()
        {
            RuleFor(x => x.SavingId).NotNull();
        }
    }
}
