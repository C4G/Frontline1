using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Api.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly HomelessnessDbContext context;
        protected readonly DbSet<T> dbSet;
        private IDictionary<Type, object> _dbSetDictionary = new Dictionary<Type, object>();

        public Repository(HomelessnessDbContext context)
        {
            this.context = context;
            this.dbSet = context.Set<T>();
        }

        public IQueryable<T> QueryAll()
        {
            return this.GetDbSet();
        }

        public async Task<IQueryable<T>> QueryAllAsync()
        {
            return await GetDbSetAsync();
        }

        public IQueryable<T> QueryAllReadOnly()
        {
            return this.QueryAll().AsNoTracking();
        }

        public async Task<IQueryable<T>> QueryAllReadOnlyAsync()
        {
            var query = await QueryAllAsync();
            return query.AsNoTracking();
        }

        public async Task<T> GetAsync(object id)
        {
            return await context.FindAsync<T>(id);
        }

        public Task<T> FindAsync(object[] keyValues)
        {
            return this.GetDbSet().FindAsync(keyValues).AsTask();
        }

        public int Add(T entity)
        {
            if (entity is IEntity)
            {
                ((IEntity)entity).CreatedDate = DateTimeOffset.Now;
            }

            this.GetDbSet().Add(entity);

            return context.SaveChanges();
        }

        public async Task<int> AddAsync(T entity)
        {
            if (entity is IEntity)
            {
                ((IEntity)entity).CreatedDate = DateTimeOffset.Now;
            }

            context.Add<T>(entity);
            return await context.SaveChangesAsync();
        }

        public void AddRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                Add(entity);
            }
        }

        public int Update(T entity)
        {
            if (entity is IEntity)
            {
                ((IEntity)entity).UpdatedDate = DateTimeOffset.Now;
            }

            this.GetDbSet().Update(entity);

            return context.SaveChanges();
        }

        public async Task<int> UpdateAsync(T entity)
        {
            if (entity is IEntity)
            {
                ((IEntity)entity).UpdatedDate = DateTimeOffset.Now;
            }

            context.Update<T>(entity);
            return await context.SaveChangesAsync();
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                if (entity is IEntity)
                {
                    ((IEntity)entity).UpdatedDate = DateTimeOffset.Now;
                }
            }

            context.UpdateRange(entities);
        }

        public int Delete(T entity)
        {
            if (entity is null)
            {
                throw new ArgumentNullException(nameof(entity), $"{nameof(entity)} cannot be null");
            }

            this.GetDbSet().Remove(entity);

            return context.SaveChanges();
        }

        public async Task<int> DeleteAsync(T entity)
        {
            context.Remove<T>(entity);
            return await context.SaveChangesAsync();
        }

        public int Delete(object id)
        {
            var entity = this.GetDbSet().Find(id);

            if (entity is not null)
            {
                Delete(entity);
            }

            return context.SaveChanges();
        }

        public void DeleteAll(IEnumerable<T> entities)
        {
            var dbSet = this.GetDbSet();

            dbSet.RemoveRange(entities);
        }

        public int SaveChanges()
        {
            return context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await context.SaveChangesAsync();
        }

        protected internal DbSet<T> GetDbSet()
        {
            var type = typeof(T);

            if (_dbSetDictionary.ContainsKey(type))
            {
                return (DbSet<T>)_dbSetDictionary[type];
            }
            else
            {
                var set = GetDbContext().Set<T>();
                _dbSetDictionary.Add(type, set);

                return (DbSet<T>)set;
            }
        }

        internal async Task<DbSet<T>> GetDbSetAsync()
        {
            var type = typeof(T);

            if (_dbSetDictionary.ContainsKey(type))
            {
                return await Task.Run(() => (DbSet<T>)_dbSetDictionary[type]);
            }
            else
            {
                var set = GetDbContext().Set<T>();
                _dbSetDictionary.Add(type, set);

                return (DbSet<T>)await Task.Run(() => set);
            }
        }

        private DbContext GetDbContext()
        {
            return context;
        }
    }
}
