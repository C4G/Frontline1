using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetCoursesQuery : IRequest<ICollection<Course>>
    {
    }
}
