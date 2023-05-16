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
    public class CourseScheduleMemberActions : GenericRepository<CourseScheduleMember>
    {
        public CourseScheduleMemberActions(digimarket_devContext db):base(db) 
        {

        }
        public override IQueryable<CourseScheduleMember> GetAll()
        {
            return ctx.CourseScheduleMembers;
        }
        public override async Task<CourseScheduleMember> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseScheduleMembers
                .FindAsync(id);
        }
        public async Task<List<CourseScheduleMember>> GetMembers(int courseScheduleCourseDetailId,int memberType)
        {
            return  await ctx.CourseScheduleMembers.Where(x => x.CourseScheduleCourseDetails == courseScheduleCourseDetailId && x.MemberType == memberType).ToListAsync();
        }

    }
}
