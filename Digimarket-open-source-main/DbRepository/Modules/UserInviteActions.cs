using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserInviteActions:GenericRepository<UserInvite>
    {
        public UserInviteActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserInvite> GetAll()
        {
            return ctx.UserInvites;
        }

        public override async Task<UserInvite> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserInvites.FindAsync(id);
        }
    }
}
