using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class SpecificUserPrmission
    {
        public int SpecificUserPrmissionId { get; set; }
        public int? ContentId { get; set; }
        public ulong? IsRequested { get; set; }
        public int? RequestBy { get; set; }
        public int? ApprovedBy { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }

        public virtual User ApprovedByNavigation { get; set; }
        public virtual UserContent Content { get; set; }
        public virtual User RequestByNavigation { get; set; }
    }
}
