namespace Homelessness.Core.Models.Responses
{
    public class SignUpResponse
    {
        public SignUpResponse(string authToken, string userName, string email)
        {
            AuthToken = authToken;
            UserName = userName;
            Email = email;
        }

        public string AuthToken { get; private set; }

        public string UserName { get; private set; }

        public string Email { get; private set; }

        public bool IsSuccessfulRegistration { get => !string.IsNullOrWhiteSpace(AuthToken); }
    }
}
