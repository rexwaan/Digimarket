using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class RolePermission
    {
        public int RolePermissionId { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Permission Permission { get; set; }
        public virtual Role Role { get; set; }
    }
}
