using Homelessness.Core.Interfaces;

namespace Homelessness.Api
{
    public class HomesslessDbSettings : IHomesslessDbSettings
    {
        public string DatabaseName { get; set; }
        public string ConnectionString { get; set; }
    }
}
