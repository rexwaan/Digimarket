using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Permission
    {
        public Permission()
        {
            RolePermissions = new HashSet<RolePermission>();
        }

        public int PermissionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DisplayName { get; set; }

        public virtual ICollection<RolePermission> RolePermissions { get; set; }
    }
}
