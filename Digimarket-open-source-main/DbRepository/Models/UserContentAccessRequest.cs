using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentAccessRequest
    {
        public int UserContentAccessRequestId { get; set; }
        public int ContentId { get; set; }
        public int? RequestBy { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string RequestedDate { get; set; }
        public ulong? Approved { get; set; }
        public string ApprovedDate { get; set; }

        public virtual UserContent Content { get; set; }
        public virtual User RequestByNavigation { get; set; }
    }
}
