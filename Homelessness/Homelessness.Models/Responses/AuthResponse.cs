namespace Homelessness.Models.Responses
{
    public class AuthResponse
    {
        public string AuthToken { get; set; }

        public string RefreshToken { get; set; }

        public bool IsAuthSuccessful { get; set; }
    }
}
