using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UsernameLoginStudentOrganization
    {
        public int UsernameLoginStudentOrganizationId { get; set; }
        public int UsernameLoginStudentId { get; set; }
        public int OrganizationId { get; set; }

        public virtual Organization Organization { get; set; }
        public virtual UsernameLoginStudent UsernameLoginStudent { get; set; }
    }
}
