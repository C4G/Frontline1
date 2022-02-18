namespace Homelessness.Domain
{
    public interface IEntity
    {
        DateTimeOffset CreatedDate { get; set; }

        DateTimeOffset? UpdatedDate { get; set; }
    }
}
