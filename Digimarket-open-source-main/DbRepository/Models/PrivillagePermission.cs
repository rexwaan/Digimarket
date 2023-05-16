using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class PrivillagePermission
    {
        public int RolePermissionId { get; set; }
        public string RoleId { get; set; }
        public string PermissionId { get; set; }
        public string OrganizationId { get; set; }
    }
}
