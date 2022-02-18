namespace Homelessness.Models.Responses
{
    public class LoginResponse
    {
        public LoginResponse(string authToken, string refreshToken, string userName, string email)
        {
            AuthToken = authToken;
            RefreshToken = refreshToken;
            UserName = userName;
            Email = email;
        }

        public string AuthToken { get; private set; }

        public string RefreshToken { get; set; }

        public string UserName { get; private set; }

        public string Email { get; private set; }

        public bool IsAuthSuccessful { get => !string.IsNullOrWhiteSpace(AuthToken); }
    }
}
