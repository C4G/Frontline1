namespace Homelessness.Models.Responses
{
    public class LoginResponse
    {
        public LoginResponse(string authToken, string refreshToken, string userName, string email, string firstName, string lastName)
        {
            AuthToken = authToken;
            RefreshToken = refreshToken;
            UserName = userName;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
        }

        public string AuthToken { get; private set; }

        public string RefreshToken { get; set; }

        public string UserName { get; private set; }

        public string Email { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public bool IsAuthSuccessful { get => !string.IsNullOrWhiteSpace(AuthToken); }
    }
}
