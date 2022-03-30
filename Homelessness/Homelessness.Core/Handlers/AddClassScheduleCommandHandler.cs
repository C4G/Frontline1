using Homelessness.Core.Commands;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class AddClassScheduleCommandHandler : IRequestHandler<AddClassScheduleCommand, ClassSchedule>
    {
        private readonly IClassScheduleRepository classScheduleRepository;

        public AddClassScheduleCommandHandler(IClassScheduleRepository classScheduleRepository)
        {
            Verify.NotNull(nameof(classScheduleRepository), classScheduleRepository);

            this.classScheduleRepository = classScheduleRepository;
        }

        public async Task<ClassSchedule> Handle(AddClassScheduleCommand request, CancellationToken cancellationToken)
        {
            var existingClassSchedule = await classScheduleRepository.GetFirstOrDefaultAsync();

            if (existingClassSchedule is not null)
            {
                existingClassSchedule.ScheduledDate = request.ScheduledDate;
                existingClassSchedule.Description = request.Description;

                await classScheduleRepository.UpdateAsync(existingClassSchedule);

                return existingClassSchedule.ToModel();
            }

            var classScheduleId = Guid.NewGuid();
            var newClassSchedule = new Domain.Entities.ClassSchedule
            { 
                Id = classScheduleId,
                ScheduledDate = request.ScheduledDate,
                Description = request.Description
            };

            await classScheduleRepository.AddAsync(newClassSchedule);

            return newClassSchedule.ToModel();
        }
    }
}
