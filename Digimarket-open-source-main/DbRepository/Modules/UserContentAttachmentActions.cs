using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserContentAttachmentActions :GenericRepository<UserContentAttachment>
    {
        public UserContentAttachmentActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserContentAttachment> GetAll()
        {
            return ctx.UserContentAttachments;
        }
        public override async Task<UserContentAttachment> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContentAttachments
                .FindAsync(id);
        }
    }
}
