using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class UserLoginModel
    {
        public string email { get; set; }
        public string password { get; set; }
    }
    public class UserLoginReturnModel
    {
        public int userId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string createdDate { get; set; }
        public bool? isActive { get; set; }
        public bool? isRoot { get; set; }
        public int? parentId { get; set; }
        public string dob { get; set; }
        public string image { get; set; }
        public string contactNumber { get; set; }
        public bool? isPlatformAdmin { get; set; }
        public List<UserPermssionsByOrganization> userOgranizations { get; set; }
    }
    public class UserDetailDTO
    {
        public int userId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public bool? isRoot { get; set; }
        public int? parentId { get; set; }
        public string dob { get; set; }
        public string image { get; set; }
        public string contactNumber { get; set; }
        public List<PermmsionsDetails> permissions { get; set; }
        public List<string> roles { get; set; }

    }
    public class MultipleUsersDTO
    {
        public UserDetailDTO newUser { get; set; }
        public UserDetailDTO oldUser { get; set; }
    }
    public class UserPermssionsByOrganization
    {
        public int organizationId { get; set; }
        public List<PermmsionsDetails> permissions { get; set; }
        public List<string> role { get; set; }
    }
    public class UserPermssionsAndRolesInOrganization: UserPermssionsByOrganization
	{
        public int userId { get; set; }
    }
    public class PermmsionsDetails
    {
        public int permissionId { get; set; }
        public string permissionName { get; set; }
    }
    public class UserNameLoginDTO
    {
        public int usernameLoginStudentId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string dob { get; set; }
        public string image { get; set; }
        public int linkParentId { get; set; }
        public string userName { get; set; }
        public int createdBy { get; set; }
        public bool? isShareInfo { get; set; }

    }
    public class AddUsernameLLoginRequestDTO: UserNameLoginDTO
    {

        public bool? isApprved { get; set; }
        public bool? isRejected { get; set; }
        public bool? isParent { get; set; }
        public List<int> organizationIds { get; set; }
    }
    public class GetUsernameLoginRequestDTO : UserNameLoginDTO
    {
        public ObjectInfo linkedParent { get; set; }
        public List<ObjectInfo> linkedOrganizations { get; set; }
        public string status { get; set; }
        public int? userId { get; set; }
        public string createdDate { get; set; }


    }
    public class UpdateUserDTO
    {
        public int userId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string dob { get; set; }
        public string password { get; set; }
        public string image { get; set; }
    }
    public class OrganizationDetailDTO
    {
        public string email { get; set;}
        public string password { get; set;}
        public int organizationId{ get; set;}
    }
    public class ResetPasswordDTO
    {
        public int userId { get; set; }
        public int? organizationId { get; set; }
        public string password { get; set; }
        public bool isAdmin { get; set; }
    }
    public class UpdateUserStatus
    {
        public int userId { get; set; }
        public int organizationId { get; set; }
        public bool active { get; set; }
    }
    public class AddEmail
    {
        public string email { get; set;}
        public int userId{ get; set;}
        public int organizationId{ get; set;}
    }
    public class VerifyEmail : AddEmail
    {
        public int pin { get; set; }
    }
    public class UpdateEmail 
    {
        public bool isNotificationsOn { get; set; }
        public int emailId { get; set; }

    }
    public class emailDTO
    {
        public string email { get; set;}
        public int emailId { get; set; }
        public bool isNotificationOn{ get; set; }
        public bool isVerified{ get; set; }
        public bool isPrimary{ get; set; }
    }
}
