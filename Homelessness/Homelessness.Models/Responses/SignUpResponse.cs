namespace Homelessness.Models.Responses
{
    public class SignUpResponse
    {
        public SignUpResponse(string authToken, string userName, string email, string firstName, string lastName)
        {
            AuthToken = authToken;
            UserName = userName;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
        }

        public string AuthToken { get; private set; }

        public string UserName { get; private set; }

        public string Email { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public bool IsSuccessfulRegistration { get => !string.IsNullOrWhiteSpace(AuthToken); }
    }
}
