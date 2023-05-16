using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentQuestion
    {
        public int UserContentQuestionId { get; set; }
        public string Question { get; set; }
        public string QuestionDescription { get; set; }
        public string Answers { get; set; }
        public ulong? IsMultiselect { get; set; }
        public int UserContentId { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual UserContent UserContent { get; set; }
    }
}
