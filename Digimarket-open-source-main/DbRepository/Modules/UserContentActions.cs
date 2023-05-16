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
    public class UserContentActions : GenericRepository<UserContent>
    {
        public UserContentActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserContent> GetAll()
        {
            return ctx.UserContents;
        }
        public override async Task<UserContent> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContents
                .FindAsync(id);
        }
        public  async Task<List<UserContent>> GetByOrganizationId(int id)
        {
            return await ctx.UserContents.Where(x => x.OrganizationId == id).ToListAsync();                
        }

        public async Task<bool> UpdateUserContentGuid(int id)
        {
            bool res = false;
            var userContent = await Get(id);
            if (userContent != null)
            {
				userContent.UserContentGuid = Guid.NewGuid().ToString();
				await UpdateAsync(userContent);
                res= true;
			}
            return res;
		}

        
    }
}
