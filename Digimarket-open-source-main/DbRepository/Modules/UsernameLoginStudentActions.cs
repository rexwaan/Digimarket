using Core.Helper;
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
	public class UsernameLoginStudentActions : GenericRepository<UsernameLoginStudent>
	{
		public UsernameLoginStudentActions(digimarket_devContext db) : base(db)
		{

		}
		public override async Task<UsernameLoginStudent> Get(int? id)
		{
			id ??= 0;
			return await ctx.UsernameLoginStudents
				.FindAsync(id);
		}
		public async Task<UsernameLoginStudent> GetByUserId(int userId)
		{
			return await ctx.UsernameLoginStudents.Where(x => x.UserId == userId).Include(x => x.LinkParent)
				.FirstOrDefaultAsync();
		}
		public async Task<User> GetLinkedParent(int userId)
		{
			return await ctx.UsernameLoginStudents.Where(x => x.UserId == userId).Include(x => x.LinkParent)?.Select(x => x.LinkParent)
				?.FirstOrDefaultAsync();
		}
		public async Task<string> GetLinkedParentName(int userId)
		{
			string name = string.Empty;
			var parent = await GetLinkedParent(userId);
			if (parent != null)
				name = parent.Firstname + " " + parent.Lastname;
			return name;
		}
		public async Task<List<int>> GetKidsByParentId(int parentId)
		{
			return await GetAll().Where(x => x.LinkParentId == parentId && x.StatusId == (int)Status.Approved).Select(x => (int)x.UserId).ToListAsync();
		}

	}
}
