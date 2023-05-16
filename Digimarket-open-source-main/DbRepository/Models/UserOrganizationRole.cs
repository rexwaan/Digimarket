using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserOrganizationRole
    {
        public int UserOrganizationRoleId { get; set; }
        public int UserOrganizationId { get; set; }
        public int RoleId { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Role Role { get; set; }
        public virtual UserOrganization UserOrganization { get; set; }
    }
}
