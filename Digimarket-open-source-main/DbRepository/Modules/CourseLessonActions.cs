using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class CourseLessonActions:GenericRepository<CourseLesson>
    {
        public CourseLessonActions(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<CourseLesson> GetAll()
        {
            return ctx.CourseLessons;
        }
        public override async Task<CourseLesson> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseLessons
                .FindAsync(id);
        }
    }
}
