using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Handlers
{
    public class GetClassScheduleQueryHandler : IRequestHandler<GetClassScheduleQuery, ClassSchedule?>
    {
        private readonly IClassScheduleRepository classScheduleRepository;

        public GetClassScheduleQueryHandler(IClassScheduleRepository classScheduleRepository)
        {
            Verify.NotNull(nameof(classScheduleRepository), classScheduleRepository);

            this.classScheduleRepository = classScheduleRepository;
        }

        public async Task<ClassSchedule?> Handle(GetClassScheduleQuery request, CancellationToken cancellationToken)
        {
            var classSchedule = await classScheduleRepository.GetFirstOrDefaultAsync();

            if (classSchedule is null)
            {
                return null;
            }

            bool currentScheduledDateIsInFuture = classSchedule.ScheduledDate.CompareTo(DateTimeOffset.Now) > 0;
            if (!currentScheduledDateIsInFuture)
            {
                return null;
            }

            return classSchedule.ToModel();
        }
    }
}
