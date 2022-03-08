using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class FileUploadCommandValidator : AbstractValidator<FileUploadCommand>
    {
        public FileUploadCommandValidator()
        {
            RuleFor(x => x.SavingId).NotNull();
            RuleFor(x => x.Files).NotEmpty();
        }
    }
}
