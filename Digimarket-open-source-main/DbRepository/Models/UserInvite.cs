using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserInvite
    {
        public int UserInviteId { get; set; }
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public int? RegisteredUserId { get; set; }
        public int RoleId { get; set; }
        public int OrganizationId { get; set; }
        public ulong? Accepted { get; set; }
        public ulong? Rejected { get; set; }
        public ulong? IsInvitationSent { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual User RegisteredUser { get; set; }
        public virtual Role Role { get; set; }
    }
}
