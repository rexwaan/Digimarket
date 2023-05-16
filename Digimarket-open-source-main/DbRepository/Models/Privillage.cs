using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Privillage
    {
        public int PrivillageId { get; set; }
        public string Name { get; set; }
        public string Details { get; set; }
        public string IsMandatory { get; set; }
        public string OrganizationId { get; set; }
    }
}
