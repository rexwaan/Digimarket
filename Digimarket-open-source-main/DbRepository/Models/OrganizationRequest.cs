using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class OrganizationRequest
    {
        public int OrganizationRequestId { get; set; }
        public string EmailAddress { get; set; }
        public string OrganizationName { get; set; }
        public int? OrganizationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ulong? OrganizationIsApproved { get; set; }
        public int? OrganizationApprovedBy { get; set; }
        public ulong? OrganizationIsRejected { get; set; }
        public int? OrganizationRejectedBy { get; set; }
        public string Reason { get; set; }
        public string About { get; set; }
        public string Logo { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string CreatedDate { get; set; }
        public ulong? IsEditRequest { get; set; }
        public int? OrganizationType { get; set; }

        public virtual User OrganizationApprovedByNavigation { get; set; }
        public virtual User OrganizationRejectedByNavigation { get; set; }
    }
}
