using Core.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class OrganizationApprovalDTO
    {
        public int OrganizationId { get; set; }
        public int CreatedBy { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public string Reason { get; set; }

    }

    public class GetOrganizationApprovalDTO
    {
        public int? organizationId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }

        public string OrganizationName { get; set; }
        public string endPoint { get; set; }
        public bool? isActive { get; set; }
        public int userId { get; set; }
        public string aboutOrganziation { get; set; }
        public string logo { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public int TypeOfOrganization { get; set; }
        public int CreatedBy { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public string Reason { get; set; }
        public bool IsEditRequest { get; set; }
        public int organizationRequestId { get; set; }

    }
}
