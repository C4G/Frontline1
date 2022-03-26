using Homelessness.Models;
using MediatR;

namespace Homelessness.Core.Queries
{
    public class GetWelcomeMessageQuery : IRequest<WelcomeMessage>
    {
    }
}
