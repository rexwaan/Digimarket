using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Parent
    {
        public int ParentId { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string EmailAddress { get; set; }
    }
}
