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
    public class OnGoingClassForUserActions : GenericRepository<OnGoingClassForUser>
    {
        public OnGoingClassForUserActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<OnGoingClassForUser> GetAll()
        {
            return ctx.OnGoingClassForUsers;
        }        

        public override async Task<OnGoingClassForUser> Get(int? id)
        {
            id ??= 0;
            return await ctx.OnGoingClassForUsers
                .FindAsync(id);
        }
        
    }
}
