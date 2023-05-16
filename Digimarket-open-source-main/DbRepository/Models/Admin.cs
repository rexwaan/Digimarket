using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Admin
    {
        public int AdminId { get; set; }
        public string Name { get; set; }
        public string AdminTypeId { get; set; }
        public string UserId { get; set; }
        public string EmailAddress { get; set; }
    }
}
