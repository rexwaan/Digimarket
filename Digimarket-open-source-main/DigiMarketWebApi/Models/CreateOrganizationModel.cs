using Core.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class CreateOrganizationModel
    {
        public int organizationId { get; set; }
        public string name { get; set; }
        public string endPoint { get; set; }
        public bool? isActive { get; set; }
        public int userId { get; set; }
        public int currentOrganizationId { get; set; }
        public string aboutOrganziation { get; set; }
        public string logo { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public OrganizationType TypeOfOrganization { get; set; }
    }
}
