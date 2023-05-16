using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserRequestActions : GenericRepository<UserRequest>
    {
        public UserRequestActions(digimarket_devContext db) : base(db)
        {

        }
        public override IQueryable<UserRequest> GetAll()
        {
            return ctx.UserRequests;
        }

        public override async Task<UserRequest> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserRequests
                .FindAsync(id);
        }
        public async Task<bool> IsExist(string email, int organizationId, int roleId)
        {
            return await ctx.UserRequests
                .AnyAsync(x =>
                            x.Email == email
                            && x.OrganizationId == organizationId
                            && x.RoleId == roleId
                            && (x.IsRejected == null || x.IsRejected != 1));
        }
        public async Task<List<UserRequest>> GetUserRequests(int organizationId, int offset, int limit)
        {
            return await ctx.UserRequests.Where(x => x.OrganizationId == organizationId && x.IsApproved == null && x.IsRejected == null).Skip(offset).Take(limit).Include(x => x.Role).ToListAsync();

        }
    }
}
