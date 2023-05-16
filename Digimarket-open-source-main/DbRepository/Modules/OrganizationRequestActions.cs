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
    public class OrganizationRequestActions:GenericRepository<OrganizationRequest>
    {
        public OrganizationRequestActions(digimarket_devContext db):base(db)
        {
        }
        public override IQueryable<OrganizationRequest> GetAll()
        {
            return ctx.OrganizationRequests;
        }


        public override async Task<OrganizationRequest> Get(int? id)
        {
            id ??= 0;
            return await ctx.OrganizationRequests.FindAsync(id);
        }
        
    }
}
