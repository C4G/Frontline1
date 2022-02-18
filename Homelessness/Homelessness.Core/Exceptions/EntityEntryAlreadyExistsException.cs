namespace Homelessness.Core.Exceptions
{
    public class EntityEntryAlreadyExistsException : Exception
    {
        public EntityEntryAlreadyExistsException(string message) : base(message) { }
    }
}
