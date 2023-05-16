using Core.Helper;
using DbRepository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class CreateContactUsModel
    {

        public int Id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string emailAddress { get; set; }
        public string phone { get; set; }
        public string topic { get; set; }
        public string message { get; set; }
        public int organizationID { get; set; }
        public int? userId { get; set; }


    }

}
