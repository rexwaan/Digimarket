using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class CourseActions:GenericRepository<Course>
    {
        public CourseActions(digimarket_devContext db):base(db) 
        {

        }
        public override IQueryable<Course> GetAll()
        {
            return ctx.Courses;
        }
        public override async Task<Course> Get(int? id)
        {
            id ??= 0;
            return await ctx.Courses
                .FindAsync(id);
        }
        
    }
}
