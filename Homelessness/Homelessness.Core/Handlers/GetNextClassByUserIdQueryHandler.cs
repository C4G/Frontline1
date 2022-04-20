using Homelessness.Core.Exceptions;
using Homelessness.Core.Helpers.Validation;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Queries;
using Homelessness.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Core.Handlers
{
    public class GetNextClassByUserIdQueryHandler : IRequestHandler<GetNextClassByUserIdQuery, NextClass?>
    {
        private readonly IUserRepository userRepository;

        public GetNextClassByUserIdQueryHandler(IUserRepository userRepository)
        {
            Verify.NotNull(nameof(userRepository), userRepository);

            this.userRepository = userRepository;
        }

        public async Task<NextClass?> Handle(GetNextClassByUserIdQuery request, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetSingleOrDefaultAsync(
                predicate: u => u.Id == request.UserId, 
                include: i => i.Include(u => u.UserCourses)
                                .ThenInclude(uc => uc.Course));

            if (user is null)
            {
                throw new EntityNotFoundException(nameof(Domain.Entities.Identity.ApplicationUser), request.UserId);
            }

            var courses = user.UserCourses
                .Where(uc => !uc.IsCompleted)
                .Select(uc => uc.Course)
                .Where(c => !c.IsDeleted)
                .OrderBy(c => c.Index);

            foreach (var course in courses)
            {
                if (course.NextClassDate.HasValue)
                {
                    bool nextClassDateIsInFuture = course.NextClassDate.Value.CompareTo(DateTimeOffset.Now) > 0;
                    if (!nextClassDateIsInFuture)
                    {
                        return null;
                    }

                    var nextClass = new NextClass
                    {
                        Title = course.Title,
                        Date = course.NextClassDate
                    };

                    return nextClass;
                }
            }

            return null;
        }
    }
}
