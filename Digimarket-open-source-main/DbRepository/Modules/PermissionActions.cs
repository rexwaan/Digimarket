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
    public class PermissionActions:GenericRepository<Permission>
    {
        public PermissionActions(digimarket_devContext db):base(db)
        {
        }
        public async Task<Permission> GetPermissionByName(string permissionName)
        {
            return await ctx.Permissions
                .FirstOrDefaultAsync(x => x.Name.Contains(permissionName));
        }
        public override async Task<Permission> Get(int? id)
        {
            id ??= 0;
            return await ctx.Permissions
                .FindAsync(id);
        }
        public  async Task<bool> IsExist(string name)
        {

            return await ctx.Permissions.AnyAsync(x => x.Name.ToLower().Trim() == name.ToLower().Trim());
        }
    }
}
