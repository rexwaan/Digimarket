using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Role
    {
        public Role()
        {
            RolePermissions = new HashSet<RolePermission>();
            UserInvites = new HashSet<UserInvite>();
            UserOrganizationRoles = new HashSet<UserOrganizationRole>();
            UserRequests = new HashSet<UserRequest>();
        }

        public int RoleId { get; set; }
        public string Name { get; set; }
        public string Details { get; set; }
        public ulong? IsMandatory { get; set; }
        public int OrganizationId { get; set; }
        public string DisplayName { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual ICollection<RolePermission> RolePermissions { get; set; }
        public virtual ICollection<UserInvite> UserInvites { get; set; }
        public virtual ICollection<UserOrganizationRole> UserOrganizationRoles { get; set; }
        public virtual ICollection<UserRequest> UserRequests { get; set; }
    }
}
