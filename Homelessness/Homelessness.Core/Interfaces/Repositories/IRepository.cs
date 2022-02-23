using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Homelessness.Core.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> QueryAll();

        Task<IQueryable<T>> QueryAllAsync();

        IQueryable<T> QueryAllReadOnly();

        Task<IQueryable<T>> QueryAllReadOnlyAsync();

        T GetFirstOrDefault(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true);

        Task<T> GetFirstOrDefaultAsync(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true);

        T GetSingleOrDefault(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true);

        Task<T> GetSingleOrDefaultAsync(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true);

        Task<T> GetAsync(object id);

        Task<T> FindAsync(object[] keyValues);

        int Add(T entity);

        Task<int> AddAsync(T entity);

        void AddRange(IEnumerable<T> entities);

        int Update(T entity);

        Task<int> UpdateAsync(T entity);

        void UpdateRange(IEnumerable<T> entities);

        int Delete(T entity);

        Task<int> DeleteAsync(T entity);

        int Delete(object id);

        void DeleteAll(IEnumerable<T> entities);

        int SaveChanges();

        Task<int> SaveChangesAsync();
    }
}
