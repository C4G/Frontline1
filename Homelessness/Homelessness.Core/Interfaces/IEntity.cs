namespace Homelessness.Core.Interfaces
{
    public interface IEntity
    {
        DateTimeOffset CreatedDate { get; set; }

        DateTimeOffset? UpdatedDate { get; set; }
    }
}
