using System;
using System.Collections.Generic;

namespace DigiMarketWebApi.Models
{
    public class UserRequestDeatilDTO : UserRequestDTO
    {
        public int userRequestId { get; set; }
        public bool? isApproved { get; set; }
        public bool? isRejected { get; set; }
        public int? approvedBy { get; set; }
        public int? rejectedBy { get; set; }
        public int? createdBy { get; set; }
    }
    public class UserRequestDTO
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string dob { get; set; }
        public string email { get; set; }
        public string contact_number { get; set; }
        public int organizationId { get; set; }
        public int? roleId { get; set; }
        public int? userId { get; set; }
        public int? currentOrganizationId { get; set; }

    }
    public class UserRequestGetDTO : UserRequestDeatilDTO
    {
        public RoleDTO role { get; set; }

    }
    public class UserRequestApprovalDTO
    {
        public int userRequestId { get; set; }
        public bool? isApproved { get; set; }
        public bool? isRejected { get; set; }
        public int? userId { get; set; }
        public int? roleId { get; set; }
    }
}
