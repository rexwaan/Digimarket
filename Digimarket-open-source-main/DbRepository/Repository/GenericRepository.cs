using DbRepository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Repository
{
    /// <summary>
    /// Sql Server Storage Strategy that we are using
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class GenericRepository<T> : IGenericRepository<T>
    where T : class
    {
        protected digimarket_devContext ctx;
        private bool _disposed;

        public GenericRepository(digimarket_devContext dbContext)
        {
            ctx = dbContext;
        }


        #region Repository Methods
        #region Add Methods
        public void Add(T entity, bool SaveChanges = true)
        {
            ctx.Set<T>().Add(entity);
            if (SaveChanges)
                Save();
        }
        public void AddRange(IEnumerable<T> entities, bool SaveChanges = true)
        {

            ctx.Set<T>().AddRange(entities);
            if (SaveChanges)
                Save();
        }
        public async Task AddAsync(T entity, bool SaveChanges = true)
        {
            ctx.Set<T>().Add(entity);
            if (SaveChanges)
                await SaveAsync();
        }
        public async Task AddRangeAsync(IEnumerable<T> entities, bool SaveChanges = true)
        {
            ctx.Set<T>().AddRange(entities);
            if (SaveChanges)
                await SaveAsync();
        }
        #endregion
        #region Remove Methods
        public void Remove(T entity, bool SaveChanges = true)
        {
            ctx.Entry(entity).State = EntityState.Detached;
            ctx.Set<T>().Attach(entity);
            ctx.Set<T>().Remove(entity);
            if (SaveChanges)
                Save();
        }
        public void RemoveRange(IEnumerable<T> entities, bool SaveChanges = true)
        {
            foreach (var item in entities)
            {
                ctx.Entry(item).State = EntityState.Detached;
                ctx.Set<T>().Attach(item);
            }
            ctx.Set<T>().RemoveRange(entities);
            if (SaveChanges)
                Save();
        }
        public async Task RemoveAsync(T entity, bool SaveChanges = true)
        {
            ctx.Entry(entity).State = EntityState.Detached;
            ctx.Set<T>().Attach(entity);
            ctx.Set<T>().Remove(entity);
            if (SaveChanges)
                await SaveAsync();
        }
        public async Task RemoveRangeAsync(IEnumerable<T> entities, bool SaveChanges = true)
        {
            foreach (var item in entities)
            {
                ctx.Entry(item).State = EntityState.Detached;
                ctx.Set<T>().Attach(item);
            }
            ctx.Set<T>().RemoveRange(entities);
            if (SaveChanges)
                await SaveAsync();
        }

        #endregion
        #region Update Methods
        public void Update(T entity, bool SaveChanges = true)
        {
            ctx.Entry(entity).State = EntityState.Modified;
            if (SaveChanges)
                Save();
        }
        public async Task UpdateAsync(T entity, bool SaveChanges = true)
        {

            ctx.Entry(entity).State = EntityState.Modified;
            if (SaveChanges)
                await SaveAsync();
        }
        #endregion



        public IEnumerable<T> FindWithCondition(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, int? skip = null, int? take = null)
        {
            IQueryable<T> query = ctx.Set<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                if (skip != null && take != null)
                {
                    return orderBy(query).Skip(skip.Value).Take(take.Value).AsNoTracking().ToList();
                }
                if (skip != null)
                {
                    return orderBy(query).Skip(skip.Value).AsNoTracking().ToList();
                }
                if (take != null)
                {
                    return orderBy(query).Take(take.Value).AsNoTracking().ToList();
                }
                return orderBy(query).AsNoTracking().ToList();
            }
            else
            {
                return query.AsNoTracking().ToList();
            }
        }
        public async Task<IEnumerable<T>> FindWithConditionAsync(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, int? skip = null, int? take = null)
        {
            IQueryable<T> query = ctx.Set<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                if (skip != null && take != null)
                {
                    return await orderBy(query).Skip(skip.Value).Take(take.Value).AsNoTracking().ToListAsync();
                }
                if (skip != null)
                {
                    return await orderBy(query).Skip(skip.Value).AsNoTracking().ToListAsync();
                }
                if (take != null)
                {
                    return await orderBy(query).Take(take.Value).AsNoTracking().ToListAsync();
                }
                return await orderBy(query).AsNoTracking().ToListAsync();
            }
            else
            {
                return await query.AsNoTracking().ToListAsync();
            }
        }

        public IQueryable<T> GetList()
        {
            return ctx.Set<T>();
        }


        public virtual T First(Expression<Func<T, bool>> filter)
        {
            return ctx.Set<T>().FirstOrDefault(filter);
        }

        public async Task<T> FirstAsync(Expression<Func<T, bool>> filter)
        {
            return await ctx.Set<T>().FirstOrDefaultAsync(filter);
        }


        public virtual T Single(Expression<Func<T, bool>> filter)
        {
            return ctx.Set<T>().SingleOrDefault(filter);
        }

        public async Task<T> SingleAsync(Expression<Func<T, bool>> filter)
        {
            return await ctx.Set<T>().SingleOrDefaultAsync(filter);
        }

        public void Save()
        {
            ctx.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await ctx.SaveChangesAsync();
        }

        public IDbContextTransaction BeginTransaction()
        {
            return ctx.Database.BeginTransaction();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await ctx.Database.BeginTransactionAsync();
        }
        protected void Dispose(bool disposing)
        {
            if (!this._disposed)
            {
                if (disposing)
                {
                    ctx.Dispose();
                }
            }
            this._disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
        public T FindById(object Id)
        {
            return ctx.Set<T>().Find(Id);
        }

        public Task<T> FindByIdAsync(object Id)
        {
            throw new NotImplementedException();
        }
        public virtual IQueryable<T> GetAll() => ctx.Set<T>();
        public virtual Task<T> Get(int? id) { throw new NotImplementedException("The GenericRepository Get Method is not Implemented"); }
        public virtual void Delete(long id) { }
        public virtual void Change(T t, Guid by) { }
        public virtual void Add(T t, Guid by) { }
        public virtual void AddRange(List<T> t) { }
        public virtual void DeleteRange(List<int> t) { }
    }
}
