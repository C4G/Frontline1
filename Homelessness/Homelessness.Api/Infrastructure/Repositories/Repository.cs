using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

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

        public T GetFirstOrDefault(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true)
        {
            IQueryable<T> query = GetQueryable(predicate, include, disableTracking);

            if (orderBy != null)
            {
                return orderBy(query).FirstOrDefault();
            }
            else
            {
                return query.FirstOrDefault();
            }
        }

        public async Task<T> GetFirstOrDefaultAsync(
           Expression<Func<T, bool>> predicate = null,
           Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
           Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
           bool disableTracking = true)
        {
            IQueryable<T> query = GetQueryable(predicate, include, disableTracking);

            if (orderBy != null)
            {
                return await orderBy(query).FirstOrDefaultAsync();
            }
            else
            {
                return await query.FirstOrDefaultAsync();
            }
        }

        public T GetSingleOrDefault(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true)
        {
            IQueryable<T> query = GetQueryable(predicate, include, disableTracking);

            if (orderBy != null)
            {
                return orderBy(query).SingleOrDefault();
            }
            else
            {
                return query.SingleOrDefault();
            }
        }

        public async Task<T> GetSingleOrDefaultAsync(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true)
        {
            IQueryable<T> query = GetQueryable(predicate, include, disableTracking);

            if (orderBy != null)
            {
                return await orderBy(query).SingleOrDefaultAsync();
            }
            else
            {
                return await query.SingleOrDefaultAsync();
            }
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
            bool implementsIEntity = typeof(T).GetInterface(nameof(IEntity)) != null;
            if (implementsIEntity)
            {
                dynamic dynEntity = entity as IEntity ?? (dynamic)entity;
                dynEntity.CreatedDate = DateTimeOffset.Now;
            }

            this.GetDbSet().Add(entity);

            return context.SaveChanges();
        }

        public async Task<int> AddAsync(T entity)
        {
            bool implementsIEntity = typeof(T).GetInterface(nameof(IEntity)) != null;
            if (implementsIEntity)
            {
                dynamic dynEntity = entity as IEntity ?? (dynamic)entity;
                dynEntity.CreatedDate = DateTimeOffset.Now;
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
            bool implementsIEntity = typeof(T).GetInterface(nameof(IEntity)) != null;
            if (implementsIEntity)
            {
                dynamic dynEntity = entity as IEntity ?? (dynamic)entity;
                dynEntity.UpdatedDate = DateTimeOffset.Now;
            }

            this.GetDbSet().Update(entity);

            return context.SaveChanges();
        }

        public async Task<int> UpdateAsync(T entity)
        {
            bool implementsIEntity = typeof(T).GetInterface(nameof(IEntity)) != null;
            if (implementsIEntity)
            {
                dynamic dynEntity = entity as IEntity ?? (dynamic)entity;
                dynEntity.UpdatedDate = DateTimeOffset.Now;
            }

            context.Update<T>(entity);
            return await context.SaveChangesAsync();
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                bool implementsIEntity = typeof(T).GetInterface(nameof(IEntity)) != null;
                if (implementsIEntity)
                {
                    dynamic dynEntity = entity as IEntity ?? (dynamic)entity;
                    dynEntity.UpdatedDate = DateTimeOffset.Now;
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

        private IQueryable<T> GetQueryable(
            Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
            bool disableTracking = true)
        {
            IQueryable<T> query = this.GetDbSet();

            if (disableTracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            return query;
        }
    }
}
