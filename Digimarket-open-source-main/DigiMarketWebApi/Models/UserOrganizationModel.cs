using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class UserOrganizationModel
    {
        
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        //public ulong? IsActive { get; set; }//question to be asked is ma value kia ho gi
        //public int OrganizationId { get; set; } this will be created automatically
        public string OrganizationName { get; set; }
        public string EndPoint { get; set; }
        //public string IsActive { get; set; }
        //public string OrganizationEmailAddress { get; set; }
        public string AboutOrganziation { get; set; }
        public int OrganizationRequestId { get; set; }
        public string ProfileInfo { get; set; }
        public string MiddleName { get; set; }
        public string Logo { get; set; }
        public string Address { get; set; }
        public string CountryCode { get; set; }
        public string ContactNumber { get; set; }
        public string OrganizationType { get; set; }
    }
}
