using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class OrganizationOwner
    {
        public int OrganizationUserId { get; set; }
        public int? UserId { get; set; }
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string ProfileInfo { get; set; }
    }
}
