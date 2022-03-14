using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetSavingsForAllUsersQuery : IRequest<IEnumerable<object>>
    {
    }
}
