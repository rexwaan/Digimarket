using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserOrganization
    {
        public UserOrganization()
        {
            UserOrganizationRoles = new HashSet<UserOrganizationRole>();
        }

        public int UserOrganizationId { get; set; }
        public int UserId { get; set; }
        public int OrganizationId { get; set; }
        public ulong? IsSelected { get; set; }
        public int? CretaedBy { get; set; }
        public string CreatedDate { get; set; }
        public ulong? IsLinked { get; set; }
        public int? LinkedUserOrganizationId { get; set; }
        public ulong? IsActive { get; set; }

        public virtual User CretaedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<UserOrganizationRole> UserOrganizationRoles { get; set; }
    }
}
