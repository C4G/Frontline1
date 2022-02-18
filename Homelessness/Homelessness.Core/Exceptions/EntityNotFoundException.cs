using Homelessness.Models.Enums;

namespace Homelessness.Core.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string entity, int entityId) { Init(entity, entityId.ToString()); }

        public EntityNotFoundException(string entity, string entityId) { Init(entity, entityId); }

        public EntityNotFoundException(string entity, Guid entityId) { Init(entity, entityId.ToString()); }

        public EntityNotFoundException(string entity, long entityId) { Init(entity, entityId.ToString()); }

        public EntityNotFoundException(string message) : base(message) { }

        public EntityNotFoundException(string message, Exception innerException) : base(message, innerException) { }

        public ErrorType ErrorCode { get; private set; }
        public string ErrorKey { get; private set; }
        public string Entity { get; private set; }
        public string EntityId { get; private set; }

        private void Init(string entity, string entityId)
        {
            ErrorCode = ErrorType.EntityNotFound;
            ErrorKey = $"{entity} not found for id {entityId}";
            Entity = entity;
            EntityId = entityId;
        }
    }
}
