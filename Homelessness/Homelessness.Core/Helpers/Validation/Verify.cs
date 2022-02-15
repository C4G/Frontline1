using System.ComponentModel.DataAnnotations;

namespace Homelessness.Core.Helpers.Validation
{
    public static class Verify
    {
        /// <summary>
        /// Verify value is not null
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        public static void NotNull<T>(string parameterName, T value)
        {
            if (value == null)
            {
                throw new ValidationException($"{parameterName} is required");
            }
        }

        /// <summary>
        /// Verifies that enumerable value is not empty
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        public static void NotEmpty<T>(string parameterName, IEnumerable<T> value)
        {
            if (value.Count() == 0)
            {
                throw new ValidationException($"{parameterName} cannot be empty");
            }
        }

        /// <summary>
        /// Verifies that Guid value is not default
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        public static void NotDefaultGuid(string parameterName, Guid value)
        {
            if (value == default(Guid) || value == Guid.Empty)
            {
                throw new ValidationException($"{parameterName} is required");
            }
        }
    }
}
