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
    public class UserContentSharingPermissionsActions : GenericRepository<UserContentSharingPermission>
    {
        public UserContentSharingPermissionsActions(digimarket_devContext db):base(db)
        {
        }
        public override IQueryable<UserContentSharingPermission> GetAll()
        {
            return ctx.UserContentSharingPermissions;
        }
        public override async Task<UserContentSharingPermission> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContentSharingPermissions
                .FindAsync(id);
        }
		public async Task EnableShareWithSpecificPeoplePermission(int id)
		{
			var res = await GetAll().FirstOrDefaultAsync(x=>x.PermissionsUserContentId == id);
			if (res != null)
			{
                res.IsPrivate = 0;
                res.SharedWithSpecificPeople = 1;
                await UpdateAsync(res);
			}
		}
	}
}
