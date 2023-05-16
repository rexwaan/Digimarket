using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DbRepository.Modules
{
    public class CourseScheduleCourseDetailActions:GenericRepository<CourseScheduleCourseDetail>
    {
        public CourseScheduleCourseDetailActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<CourseScheduleCourseDetail> GetAll()
        {
            return ctx.CourseScheduleCourseDetails;
        }
        public override async Task<CourseScheduleCourseDetail> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseScheduleCourseDetails
                .FindAsync(id);
        }
        public async Task<CourseScheduleCourseDetail> GetById(int? id)
        {
            return await ctx.CourseScheduleCourseDetails.Where(x => x.CourseScheduleCourseDetailsId == id)
                .Include(x => x.CourseScheduleMembers)
                .Include(x => x.Teacher)
                .Include(x => x.Location)
                .Include(x => x.UserContent)
                .FirstOrDefaultAsync();
                
        }

    }
}
