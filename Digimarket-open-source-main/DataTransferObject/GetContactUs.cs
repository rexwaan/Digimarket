using System;
using System.Collections.Generic;
using System.Text;

namespace DataTransferObject
{
    public class GetContactUs
    {
        public int ContactUsId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string Phone { get; set; }
        public string Topic { get; set; }
        public string Message { get; set; }
        public bool? IsArchived { get; set; }
    }
}
