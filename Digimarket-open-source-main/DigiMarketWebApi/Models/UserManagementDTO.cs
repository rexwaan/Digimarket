using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class RoleDTO
    {
        public int roleId { get; set; }
        public string name { get; set; }
        public string details { get; set; }
        public bool? isMandatory { get; set; }
        public int organizationId { get; set; }
        public string displayName { get; set; }
        public int created_by { get; set; }
        public bool isRoleInUse { get; set; }
    }
    public class PermissionDTO
    {
        public int permissionId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string display_name { get; set; }
    }
    public class RolePermissionDTO
    {
        public int roleId { get; set; }
        public List<int> permissionIds { get; set; }
        public int created_by { get; set; }
    }
    public class RolePermissionDetailsDTO
    {
        public int roleId { get; set; }
        public RoleDTO role { get; set; }
        public int permissionId { get; set; }
        public PermissionDTO permission { get; set; }
        public int created_by { get; set; }
    }
    public class UserOrganizationRoleDTO
    {
        public int organizationId { get; set; }
        public List<int> roleIds { get; set; }
        public int userId { get; set; }
    }
    public class UserRoleDetailsDTO
    {
        public UserDTO user { get; set; }
        public List<RoleDTO> roles { get; set; }
        public string status { get; set; }
        public string date { get; set; }
        public bool? isActive { get; set; }

    }
    public class UserDTO
    {
        public int userId { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string contact { get; set; }
        public string dob { get; set; }
        public string image { get; set; }


    }
    public class InviteUserModel
    {
        public int organizationId { get; set; }
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public int roleId { get; set; }
        public int userId { get; set; }

    }
    public class InviteUserDetailModelDTO : InviteUserModel
    {
        public RoleDTO role { get; set; }
        public UserDTO user { get; set; }
        public string organizationName { get; set; }
    }
    public class InvitationAcceptRejectDTO : InviteUserModel
    {
        public int invitationId { get; set; }
        public bool? accpted { get; set; }
        public bool? rejected { get; set; }
        public string password { get; set; }
        public string dob { get; set; }
        public string contact { get; set; }
    }
    public class UserRolePermissionDetailsDTO
    {
        public int userId { get; set; }
        public int organizationId { get; set; }
        public List<RolesDetails> RolesDetails { get; set; }
    }
    public class RolesDetails
    {
        public RoleDTO role { get; set; }
        public List<PermissionDTO> permissions { get; set; }

    }
}


