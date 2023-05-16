using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserRequest
    {
        public int UserRequestId { get; set; }
        public int OrganizationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public ulong? IsApproved { get; set; }
        public int? ApprovedBy { get; set; }
        public ulong? IsRejected { get; set; }
        public int? RejectedBy { get; set; }
        public string Reason { get; set; }
        public string Dob { get; set; }
        public string ContactNumber { get; set; }
        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public string CreatedDate { get; set; }

        public virtual User ApprovedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual User RejectedByNavigation { get; set; }
        public virtual Role Role { get; set; }
        public virtual User User { get; set; }
    }
}
