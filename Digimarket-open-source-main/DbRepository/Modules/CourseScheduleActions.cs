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
    public class CourseScheduleActions:GenericRepository<CourseSchedule>
    {
        public CourseScheduleActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<CourseSchedule> GetAll()
        {
            return ctx.CourseSchedules;
        }
       


        public override async Task<CourseSchedule> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseSchedules
                .FindAsync(id);
        }
        public async Task<CourseSchedule> GetById(int id)
        {
            return await ctx.CourseSchedules.Where(x => x.CourseScheduleId == id)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.UserContent)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.Teacher)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.Location)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
                .Include(x => x.Course)
                .FirstOrDefaultAsync();
        }
    }
}
