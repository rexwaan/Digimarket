using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Repository
{
    public interface IGenericRepository<Entity>
    {
        void Add(Entity entity, bool SaveChanges = true);
        void AddRange(IEnumerable<Entity> entities, bool SaveChanges = true);
        Task AddAsync(Entity entity, bool SaveChanges = true);
        Task AddRangeAsync(IEnumerable<Entity> entities, bool SaveChanges = true);
        void Remove(Entity entity, bool SaveChanges = true);
        void RemoveRange(IEnumerable<Entity> entities, bool SaveChanges = true);
        Task RemoveAsync(Entity entity, bool SaveChanges = true);
        Task RemoveRangeAsync(IEnumerable<Entity> entities, bool SaveChanges = true);
        void Update(Entity entity, bool SaveChanges = true);
        Task UpdateAsync(Entity entity, bool SaveChanges = true);

        Entity FindById(object Id);
        Task<Entity> FindByIdAsync(object Id);
        IQueryable<Entity> GetList();

        IEnumerable<Entity> FindWithCondition(Expression<Func<Entity, bool>> filter = null, Func<IQueryable<Entity>, IOrderedQueryable<Entity>> orderBy = null, int? skip = null, int? take = null);
        Task<IEnumerable<Entity>> FindWithConditionAsync(Expression<Func<Entity, bool>> filter = null, Func<IQueryable<Entity>, IOrderedQueryable<Entity>> orderBy = null, int? skip = null, int? take = null);
        Entity Single(Expression<Func<Entity, bool>> where);
        Task<Entity> SingleAsync(Expression<Func<Entity, bool>> where);
        Entity First(Expression<Func<Entity, bool>> where);
        Task<Entity> FirstAsync(Expression<Func<Entity, bool>> where);

        void Save();
        Task SaveAsync();
        IDbContextTransaction BeginTransaction();
        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
