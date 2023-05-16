using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class ParentStudent
    {
        public int ParentStudentId { get; set; }
        public string ParentId { get; set; }
        public string StudentId { get; set; }
        public string RelationType { get; set; }
        public string OrganizationId { get; set; }
    }
}
