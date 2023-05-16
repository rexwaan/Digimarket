using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class SignInAnotherOrgModel
    {
        public string organizationName { get; set; }
        public string  email { get; set; }
        public string password { get; set; }
        public int rootuserid { get; set; }
    }
}
