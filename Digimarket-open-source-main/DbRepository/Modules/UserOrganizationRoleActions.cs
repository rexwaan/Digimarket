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
	public class UserOrganizationRoleActions : GenericRepository<UserOrganizationRole>
	{
		public UserOrganizationRoleActions(digimarket_devContext db) : base(db)
		{

		}
		public override IQueryable<UserOrganizationRole> GetAll()
		{
			return ctx.UserOrganizationRoles;
		}


		public override async Task<UserOrganizationRole> Get(int? id)
		{
			id ??= 0;
			return await ctx.UserOrganizationRoles.FindAsync(id);
		}
		public async Task<List<int>> GetUserOrganizationRoleBy(List<int> roleIds)
		{
			return await GetAll().Where(x => roleIds.Contains(x.RoleId) && x.UserOrganization.IsActive != 0)
				.Select(x => x.UserOrganizationId).ToListAsync();
		}
		public async Task<List<string>> GetRolesByUser(int userOrganizationId)
		{
			return await GetAll().Where(x => x.UserOrganizationId == userOrganizationId).Include(x => x.Role).Select(x => x.Role.Name).ToListAsync();
		}
	}
}
