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
    public class CourseScheduleAttendanceAction : GenericRepository<CourseScheduleAttendance>
    {
        public CourseScheduleAttendanceAction(digimarket_devContext db) : base(db)
        {

        }
        public override IQueryable<CourseScheduleAttendance> GetAll()
        {
            return ctx.CourseScheduleAttendances;
        }
        public override async Task<CourseScheduleAttendance> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseScheduleAttendances
                .FindAsync(id);
        }
        public async Task<(string status,int id)> GetAttendaceStatus(int userId, int courseScheduleDeatilId)
        {
            int id = 0;
            string status = "No";
            var data = (await ctx.CourseScheduleAttendances.FirstOrDefaultAsync(x => x.UserId == userId && x.CourseScheduleCourseDetailsId == courseScheduleDeatilId));
            if (data != null)
            {
                status = data.IsPresent == 1 ? "Yes" : "No";
                id = data.CourseScheduleAttendanceId;
            }
            return (status,id);
        }
    }
}
