using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentScratchProject
    {
        public int UserContentScratchProjectId { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public int UserContentId { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual UserContent UserContent { get; set; }
    }
}
