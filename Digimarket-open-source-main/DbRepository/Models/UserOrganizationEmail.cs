using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserOrganizationEmail
    {
        public int UserOrganizationEmailId { get; set; }
        public int UserId { get; set; }
        public int? OrganizationId { get; set; }
        public string Email { get; set; }
        public int? Pin { get; set; }
        public string PinGeneratedAt { get; set; }
        public ulong IsVerified { get; set; }
        public ulong IsNotificationOn { get; set; }
        public ulong IsPrimary { get; set; }

        public virtual Organization Organization { get; set; }
        public virtual User User { get; set; }
    }
}
