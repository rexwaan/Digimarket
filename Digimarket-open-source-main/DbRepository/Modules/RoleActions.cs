using Core.Helper;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class RoleActions:GenericRepository<Role>
    {
        public RoleActions(digimarket_devContext db):base(db)
        {
        }
        public override IQueryable<Role> GetAll()
        {
            return ctx.Roles;
        }

        public override async Task<Role> Get(int? id)
        {
            id ??= 0;
            return await ctx.Roles.FindAsync(id);
        }
        public List<RoleType> GetAllRoles()
        {
            return Enum.GetValues(typeof(RoleType)).Cast<RoleType>().ToList();

        }
        public async Task<bool> IsExist(int organizationId,int roleId ,string name)
        {

            return await ctx.Roles.AnyAsync(x => x.OrganizationId == organizationId && (x.RoleId == roleId || name.ToLower().Trim() == x.Name.ToLower().Trim()));
        }
    }
}
