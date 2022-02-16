namespace Homelessness.Core.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> QueryAll();

        Task<IQueryable<T>> QueryAllAsync();

        IQueryable<T> QueryAllReadOnly();

        Task<IQueryable<T>> QueryAllReadOnlyAsync();

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
