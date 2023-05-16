using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserPrivillage
    {
        public int UserPrivillageId { get; set; }
        public string UserId { get; set; }
        public string PrivillageId { get; set; }
        public string OrganizationId { get; set; }
    }
}
