using Core.Helper;
using DataTransferObject;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace DbRepository.Modules
{
	public class UserOrganizationActions : GenericRepository<UserOrganization>
	{
		private readonly RolePermissionActions rolePermissionActions;
		private readonly UserOrganizationRoleActions userOrganizationRoleActions;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly PermissionActions permissionActions;

		public UserOrganizationActions(PermissionActions permissionActions, digimarket_devContext db, RolePermissionActions rolePermissionActions, UserOrganizationRoleActions userOrganizationRoleActions, UserOrganizationEmailActions userOrganizationEmailActions) : base(db)
		{
			this.permissionActions = permissionActions;
			this.rolePermissionActions = rolePermissionActions;
			this.userOrganizationRoleActions = userOrganizationRoleActions;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
		}
		public override IQueryable<UserOrganization> GetAll()
		{
			return ctx.UserOrganizations;
		}


		public override async Task<UserOrganization> Get(int? id)
		{
			id ??= 0;
			return await ctx.UserOrganizations.FindAsync(id);
		}
		public async Task AddAsync(UserOrganization userOrganization)
		{
			userOrganization.IsActive = 1;
			await base.AddAsync(userOrganization);
		}
		public async Task<UserOrganization> GetUserOrganization(int organizationId, int userId)
		{
			return await ctx.UserOrganizations
				.FirstOrDefaultAsync(x => x.OrganizationId == organizationId && x.UserId == userId);
		}
		public async Task<List<EmailWithUserDTO>> GetEmailsByPermission(int organizationId, int permissionId)
		{
			var userIds = (await GetUsersByPermission(organizationId, permissionId)).Select(x => x.UserId).ToList();
			var emailDetails = await userOrganizationEmailActions.GetEmailsByOrganizationForNotifications( userIds,organizationId);
            return emailDetails;
		}
		public async Task<List<User>> GetUsersByPermission(int organizationId, int permissionId)
		{
			var rolesHavingPermission = await rolePermissionActions.GetPermissionsByOrganization(permissionId, organizationId);
			var usersOrgns = await userOrganizationRoleActions.GetUserOrganizationRoleBy(rolesHavingPermission);
			var users = await GetAll().Where(x => usersOrgns.Contains(x.UserOrganizationId) && x.OrganizationId == organizationId)
				.Include(x => x.User).Select(x => x.User).ToListAsync();
			users = users.DistinctBy(x => x.UserId);
			return users;
		}
		public async Task<bool> ChangeUserActiveStatus(List<int> userIds, int organizationId, bool? status)
		{
			var userOrganization = await GetAll().Where(x => userIds.Contains(x.UserId) && x.OrganizationId == organizationId).ToListAsync();
			if (userOrganization == null)
				return false;
			return await UpdateUserStatus(userOrganization, status);
		}
		private async Task<bool> UpdateUserStatus(List<UserOrganization> userOrganization,bool? status)
		{
			userOrganization.ForEach(c => c.IsActive = status.ConvertToUlong());
			ctx.UpdateRange(userOrganization);
			await SaveAsync();
			return true;
		}
		public async Task<(List<EmailWithUserDTO> emails,bool success,string msg)> GetEmailsWhoHasManageSchedulePermissionAsync(int organizationId)
		{
			var permission = await permissionActions.GetPermissionByName(Permissions.manage_lessons_scheduling_and_assign_students_to_classes.GetDescription());
			if (permission == null)
			{
				return (new List<EmailWithUserDTO>(),false,"Permission not found");

			}
			var email = await GetEmailsByPermission(organizationId, permission.PermissionId);
			return (email ?? new List<EmailWithUserDTO>(),true,"");
		}
		public async Task<(List<EmailWithUserDTO> emails,bool success,string msg)> GetEmailsWhoHasContactUsPermissionAsync(int organizationId)
		{
			var permission = await permissionActions.GetPermissionByName(Permissions.get_email_notification_for_contact_us_form_submission.GetDescription());
			if (permission == null)
			{
				return (new List<EmailWithUserDTO>(),false,"Permission not found");

			}
			var email = await GetEmailsByPermission(organizationId, permission.PermissionId);
			return (email ?? new List<EmailWithUserDTO>(),true,"");
		}

	public async Task<List<User>> GetStudentsForSchedule(int organizationId, int permissionId)
        {
            var rolesHavingPermission = await rolePermissionActions.GetPermissionsByOrganization(permissionId, organizationId);
            var usersOrgns = await userOrganizationRoleActions.GetUserOrganizationRoleBy(rolesHavingPermission);
            var users = await GetAll().Where(x => usersOrgns.Contains(x.UserOrganizationId) && x.OrganizationId == organizationId && (x.UserOrganizationRoles.Any(n => n.Role.Name == RoleType.Student.ToString() || n.Role.Name == RoleType.UsernameLoginStudent.ToString())))
                .Include(x => x.User).Select(x => x.User).ToListAsync();
            users = users.DistinctBy(x => x.UserId);
            return users;
        }
        public async Task<List<User>> GetAddionalParticipantForSchedule(int organizationId, int permissionId)
        {
            var rolesHavingPermission = await rolePermissionActions.GetPermissionsByOrganization(permissionId, organizationId);
            var usersOrgns = await userOrganizationRoleActions.GetUserOrganizationRoleBy(rolesHavingPermission);
            var users = await GetAll().Where(x => usersOrgns.Contains(x.UserOrganizationId) && x.OrganizationId == organizationId && (x.UserOrganizationRoles.Any(n => n.Role.Name != RoleType.Student.ToString() && n.Role.Name != RoleType.UsernameLoginStudent.ToString())))
                .Include(x => x.User).Select(x => x.User).ToListAsync();
            users = users.DistinctBy(x => x.UserId);
            return users;
        }
    }
}
