using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class ContactU
    {
        public int ContactUsId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string Phone { get; set; }
        public string Topic { get; set; }
        public string Message { get; set; }
        public int? ContactUsOrganizationId { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public ulong? IsArchived { get; set; }

        public virtual Organization ContactUsOrganization { get; set; }
        public virtual User CreatedByNavigation { get; set; }
    }
}
