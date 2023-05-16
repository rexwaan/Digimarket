using DataTransferObject;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace DbRepository.Modules
{
    public class ContactUsActions:GenericRepository<ContactU>
    {
        public ContactUsActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<ContactU> GetAll()
        {
            return ctx.ContactUs;
        }
        public async Task<List<GetContactUs>> GetAllByOrganizationAsync(int organizationId,bool getArchivedAlso)
        {
            Expression<Func<ContactU, bool>> wherePredicate = x =>
            x.ContactUsOrganizationId == organizationId &&
            ((getArchivedAlso == true) ||
            (getArchivedAlso == false && x.IsArchived != 1));

            var data = (await GetAll().Where(wherePredicate).ToListAsync()).Select(x => new GetContactUs()
            {
                ContactUsId = x.ContactUsId,
                EmailAddress = x.EmailAddress,
                FirstName = x.FirstName,
                LastName = x.LastName,
                IsArchived = x.IsArchived.ConvertToBool() ?? false,
                Message = x.Message,
                Phone = x.Phone,
                Topic = x.Topic,
            }).ToList();

            return data;
        }
        public async Task<ContactU> GetContactUs(int organizationId,int id)
        {
            return await GetAll().FirstOrDefaultAsync(x => x.ContactUsOrganizationId == organizationId && x.ContactUsId == id);
        }
        

        public override async Task<ContactU> Get(int? id)
        {
            id ??= 0;
            return await ctx.ContactUs
                .FindAsync(id);
        }
        
    }
}
