using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class SpecificUserPrmissionActions:GenericRepository<SpecificUserPrmission>
    {
        public SpecificUserPrmissionActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<SpecificUserPrmission> GetAll()
        {
            return ctx.SpecificUserPrmissions;
        }
        public override async Task<SpecificUserPrmission> Get(int? id)
        {
            id ??= 0;
            return await ctx.SpecificUserPrmissions
                .FindAsync(id);
        }
    }
}
