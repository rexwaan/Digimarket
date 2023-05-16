using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class UserOrganizationGetModel
    {

        public int OrganizationId { get; set; }
        public string Name { get; set; }
        public string EndPoint { get; set; }
        public bool? IsActive { get; set; }
        public string EmailAddress { get; set; }
        public string AboutOrganziation { get; set; }
        public bool IsSelected { get; set; }
        public string Logo { get; set; }
        public ulong? IsApproved { get; set; }
        public ulong? IsRejected { get; set; }
        public int? ApprovedBy { get; set; }
        public int? RejectedBy { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public int? TypeOfOrganization { get; set; }
        public int? Creator { get; set; }
        public bool isUserExistInOrganization { get; set; }
    }
    public class UserOrganizationDTO
    {
        public List<UserOrganizationGetModel> organizations { get; set; }
        public UserDetailDTO newUser { get; set; }
    }
}
