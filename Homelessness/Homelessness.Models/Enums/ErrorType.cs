namespace Homelessness.Models.Enums
{
    public enum ErrorType
    {
        /// <summary>
        ///     Bad request.
        /// </summary>
        BadRequest = 400,

        /// <summary>
        ///     Invalid value.
        /// </summary>
        InvalidValue = 417,

        /// <summary>
        ///     Entity not found.
        /// </summary>
        EntityNotFound = 500
    }
}
