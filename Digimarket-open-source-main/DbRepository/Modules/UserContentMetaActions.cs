using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserContentMetaActions :GenericRepository<UserContentMetum>
    {
        public UserContentMetaActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserContentMetum> GetAll()
        {
            return ctx.UserContentMeta;
        }
        public override async Task<UserContentMetum> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContentMeta
                .FindAsync(id);
        }
    }
}
