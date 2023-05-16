using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UsernameLoginStudent
    {
        public UsernameLoginStudent()
        {
            UsernameLoginStudentOrganizations = new HashSet<UsernameLoginStudentOrganization>();
        }

        public int UsernameLoginStudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Dob { get; set; }
        public int LinkParentId { get; set; }
        public string UserName { get; set; }
        public int? StatusId { get; set; }
        public string Status { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public ulong? IsParent { get; set; }
        public ulong? IsShareInfo { get; set; }
        public int? UserId { get; set; }
        public string Image { get; set; }
        public ulong? IsDeleted { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual User LinkParent { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<UsernameLoginStudentOrganization> UsernameLoginStudentOrganizations { get; set; }
    }
}
