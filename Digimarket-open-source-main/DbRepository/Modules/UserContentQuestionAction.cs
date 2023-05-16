using DbRepository.Models;
using DbRepository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbRepository.Modules
{
    public class UserContentQuestionAction : GenericRepository<UserContentQuestion>
    {
        public UserContentQuestionAction(digimarket_devContext db):base(db)
        {

        }
        public override IQueryable<UserContentQuestion> GetAll()
        {
            return ctx.UserContentQuestions;
        }
        public override async Task<UserContentQuestion> Get(int? id)
        {
            id ??= 0;
            return await ctx.UserContentQuestions
				.FindAsync(id);
        }
    }
}
