using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Student
    {
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Dob { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedDate { get; set; }
        public string CreatedIp { get; set; }
        public string ModifiedId { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public string UserId { get; set; }
        public ulong? HasEmail { get; set; }
        public string EmailAddress { get; set; }
    }
}
