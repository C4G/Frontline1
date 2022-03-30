using Homelessness.Core.Commands;
using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class UpdateClassScheduleCommandHandler : IRequestHandler<UpdateClassScheduleCommand, int>
    {
        private readonly IClassScheduleRepository classScheduleRepository;

        public UpdateClassScheduleCommandHandler(IClassScheduleRepository classScheduleRepository)
        {
            Verify.NotNull(nameof(classScheduleRepository), classScheduleRepository);

            this.classScheduleRepository = classScheduleRepository;
        }

        public async Task<int> Handle(UpdateClassScheduleCommand request, CancellationToken cancellationToken)
        {
            var classSchedule = await classScheduleRepository.GetFirstOrDefaultAsync(q => q.Id == request.ClassScheduleId);

            if (classSchedule is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.ClassSchedule), request.ClassScheduleId);
            }

            classSchedule.ScheduledDate = request.ScheduledDate;
            classSchedule.Description = request.Description;

            return await classScheduleRepository.UpdateAsync(classSchedule);
        }
    }
}
