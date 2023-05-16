using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UsernameLoginStudentOrganizationActions:GenericRepository<UsernameLoginStudentOrganization>
    {
        public UsernameLoginStudentOrganizationActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UsernameLoginStudentOrganization> GetAll()
        {
            return ctx.UsernameLoginStudentOrganizations;
        }

        public override async Task<UsernameLoginStudentOrganization> Get(int? id)
        {
            id ??= 0;
            return await ctx.UsernameLoginStudentOrganizations.FindAsync(id);
        }
        public  async Task<List<int?>> GetStudentsbyParent(int parentId, int organizationId)
        {
            return await ctx.UsernameLoginStudentOrganizations.Where(x => x.OrganizationId == organizationId && x.UsernameLoginStudent.LinkParentId == parentId).Select(x => x.UsernameLoginStudent.UserId).ToListAsync();
        }
    }
}
