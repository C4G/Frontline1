namespace Homelessness.Core.Interfaces
{
    public interface IHomesslessDbSettings
    {
        string DatabaseName { get; set; }
        string ConnectionString { get; set; }
    }
}
