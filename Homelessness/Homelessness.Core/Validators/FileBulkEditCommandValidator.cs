using FluentValidation;
using Homelessness.Core.Commands;

namespace Homelessness.Core.Validators
{
    public class FileBulkEditCommandValidator : AbstractValidator<FileBulkEditCommand>
    {
        public FileBulkEditCommandValidator()
        {
            RuleFor(x => x.FileCollection).NotNull().NotEmpty();
        }
    }
}
