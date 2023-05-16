using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserContentScratchProjectActions : GenericRepository<UserContentScratchProject>
    {
        public UserContentScratchProjectActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserContentScratchProject> GetAll()
        {
            return ctx.UserContentScratchProjects;
        }
        public override async Task<UserContentScratchProject> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContentScratchProjects
				.FindAsync(id);
        }
    }
}
