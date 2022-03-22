using Homelessness.Models.Responses;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetUserByIdQuery : IRequest<UserDataResponse>
    {
        public Guid UserId { get; set; }


        public GetUserByIdQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
