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
    public class OrganizationActions : GenericRepository<Organization>
    {
        public OrganizationActions(digimarket_devContext db) : base(db)
        {

        }
        public override IQueryable<Organization> GetAll()
        {
            return ctx.Organizations.Where(x=>x.IsDeleted !=1);
        }
        public async Task<Organization> GetByEmail(string email)
        {
            return await ctx.Organizations.FirstOrDefaultAsync(x => x.EmailAddress == email);
        }

        public override async Task<Organization> Get(int? id)
        {
            
            return await ctx.Organizations.FindAsync(id);
        }
        public async Task<Organization> GetByEndPoint(string endPoint)
        {
            return await ctx.Organizations
                .FirstOrDefaultAsync(x => x.EndPoint == endPoint);
        }
        public async Task<bool> IsExist(string email)
        {
            return await ctx.Organizations
                .AnyAsync(x => x.EmailAddress == email);
        }


    }
}
