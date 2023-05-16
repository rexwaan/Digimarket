using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class CourseLocationActions : GenericRepository<CourseLocation>
    {
        public CourseLocationActions(digimarket_devContext db):base(db) 
        {

        }
        public override IQueryable<CourseLocation> GetAll()
        {
            return ctx.CourseLocations;
        }
        public override async Task<CourseLocation> Get(int? id)
        {
            id ??= 0;
            return await ctx.CourseLocations
                .FindAsync(id);
        }
    }
}
