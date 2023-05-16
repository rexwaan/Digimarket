using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Microsoft.Extensions.Options;
using System.Xml.Linq;
using System.Linq.Expressions;
using System.Runtime.InteropServices;
using DbRepository.Modules;
using System.Net;

namespace DigiMarketWebApi.Controllers
{
	public class UserManagementController : BaseController
	{
		private readonly UserRequestActions userRequestActions;
		private readonly UserInviteActions userInviteActions;
		private readonly OrganizationActions organizationActions;
		private readonly UserActions userActions;
		private readonly CourseScheduleCourseDetailActions courseScheduleCourseDetailActions;
		private readonly UsernameLoginStudentActions usernameLoginStudentActions;
		private readonly CourseScheduleMemberActions courseScheduleMemberActions;
		private readonly UserOrganizationRoleActions userOrganizationRoleActions;
		private readonly UserOrganizationActions userOrganizationActions;
		private readonly RolePermissionActions rolePermissionActions;
		private readonly PermissionActions permissionActions;
		private readonly RoleActions roleActions;
		private readonly IMailRepo mailRepo;
		private readonly Appsettings _appSettings;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;

		public UserManagementController(UserRequestActions userRequestActions, UserInviteActions userInviteActions, OrganizationActions organizationActions, UserActions userActions, CourseScheduleCourseDetailActions courseScheduleCourseDetailActions, UsernameLoginStudentActions usernameLoginStudentActions, CourseScheduleMemberActions courseScheduleMemberActions, UserOrganizationRoleActions userOrganizationRoleActions, UserOrganizationActions userOrganizationActions, RolePermissionActions rolePermissionActions, PermissionActions permissionActions, RoleActions roleActions, IMailRepo _mailRepo, IOptions<Appsettings> appSettings, UserOrganizationEmailActions userOrganizationEmailActions):base(_mailRepo,userOrganizationEmailActions)
		{
			this.userRequestActions = userRequestActions;
			this.userInviteActions = userInviteActions;
			this.organizationActions = organizationActions;
			this.userActions = userActions;
			this.courseScheduleCourseDetailActions = courseScheduleCourseDetailActions;
			this.usernameLoginStudentActions = usernameLoginStudentActions;
			this.courseScheduleMemberActions = courseScheduleMemberActions;
			this.userOrganizationRoleActions = userOrganizationRoleActions;
			this.userOrganizationActions = userOrganizationActions;
			this.rolePermissionActions = rolePermissionActions;
			this.permissionActions = permissionActions;
			this.roleActions = roleActions;
			mailRepo = _mailRepo;
			_appSettings = appSettings.Value;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
		}
		[HttpGet]
		[Route("GetRolesByOrganization")]
		public async Task<dynamic> GetRolesByOrganizationAsync(int organizationId)
		{
			var organizationRoles = await roleActions.GetAll().Where(x => x.OrganizationId == organizationId).ToListAsync();
			if (organizationRoles == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Error Please contact admin!",
				});
			}
			else
			{
				List<RoleDTO> rolesList = new List<RoleDTO>();
				foreach (var x in organizationRoles)
				{
					rolesList.Add(await CreateRoleDTOAsync(x));

				}
				return StatusCode(200, new
				{
					statusCode = 200,
					result = rolesList,
					message = $"{rolesList.Count} Role(s) Found agianst this organization!"
				});
			}
		}
		[HttpPost]
		[Route("AddPermission")]
		public async Task<dynamic> AddPermissionAsync(PermissionDTO permission)
		{
			var isExist = await permissionActions.IsExist(permission.name);
			if (isExist)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Permission Already exist!",
				});
			}
			if (permission.permissionId == 0)
			{
				// add role table
				Permission permissionObj = new Permission()
				{
					Name = permission.name,
					DisplayName = permission.display_name,
					Description = permission.description,
				};
				await permissionActions.AddAsync(permissionObj);
				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = "Permission Added!",
				});
			}
			else // for update
			{
				var existingRole = await permissionActions.Get(permission.permissionId);
				existingRole.Name = permission.name;
				existingRole.DisplayName = permission.display_name;
				existingRole.Description = permission.description;
				await permissionActions.UpdateAsync(existingRole);
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Permission Updated!",
				});
			}

		}
		[HttpGet]
		[Route("GePermissions")]
		public async Task<dynamic> GePermissionsAsync()
		{
			var permissions = await permissionActions.GetAll().ToListAsync();
			if (permissions == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Error Please contact admin!",
				});
			}
			else
			{
				List<PermissionDTO> permissionList = new List<PermissionDTO>();
				permissions.ForEach(x =>
				{
					permissionList.Add(CreatePermissionDTO(x));
				});
				return StatusCode(200, new
				{
					statusCode = 200,
					result = permissionList,
					message = $"{permissionList.Count} Permissions Found!"
				});
			}
		}
		[HttpGet]
		[Route("GePermissionsByRole")]
		public async Task<dynamic> GePermissionsByRoleAsync(int roleId)
		{
			var permissions = await rolePermissionActions.GetAll().Where(x => x.RoleId == roleId).Include(x => x.Permission).ToListAsync();
			if (permissions == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"No Permissions Found against this role!",
				});
			}
			else
			{
				List<PermissionDTO> permissionList = new List<PermissionDTO>();
				permissions.ForEach(x =>
				{
					permissionList.Add(CreatePermissionDTO(x.Permission));
				});
				return StatusCode(200, new
				{
					statusCode = 200,
					result = permissionList,
					message = $"{permissionList.Count} Permissions Found against this role!"
				});
			}
		}
		[HttpGet]
		[Route("GetUsersWithRolesByOrganization")]
		public async Task<dynamic> GetUsersWithRolesByOrganizationAsync(int organizationId, int offset, int limit, bool getAll = false, bool getInvitedUsers = false)
		{
			limit = limit == 0 ? 10 : limit;
			Expression<Func<UserOrganization, bool>> wherePredicate = x =>
							(x.OrganizationId == organizationId && x.IsLinked != 1
							&& (getAll != false || (getAll == false && x.UserId != x.Organization.Creator)));
			var userOrganizations = await userOrganizationActions.GetAll().Where(wherePredicate)
				.Skip(offset).Take(limit).Include(x => x.User).ToListAsync();
			if (userOrganizations == null)
				return StatusCode(404, new
				{
					statusCode = 404,
					result = string.Empty,
					message = $"Error Please contact admin!",
				});
			List<UserRoleDetailsDTO> userRoleDetails = new List<UserRoleDetailsDTO>();
			foreach (var userOrganization in userOrganizations)
			{
				// get all the roles assigned to the user from user organization
				var userOrganizationRoles = await userOrganizationRoleActions.GetAll().Where(x => x.UserOrganizationId == userOrganization.UserOrganizationId)
					.Include(x => x.Role)
					.Select(x => x.Role)
					.ToListAsync();
				userRoleDetails.Add(await CreateUserRoleDetailsDTOAsync(userOrganization.User, userOrganizationRoles, userOrganization.IsActive.ConvertToBool(),organizationId));
			}
			if (getInvitedUsers)
			{
				int newOffset = 0;
				int remainingLimit = limit;
				if (userRoleDetails.Count() == 0)
				{
					var total_Count = await userOrganizationActions.GetAll().CountAsync(wherePredicate);
					newOffset = offset - total_Count;
				}
				else
				{
					remainingLimit = limit - userRoleDetails.Count();
				}
				var invitedUserRequestList = await userInviteActions.GetAll().Where(x => x.OrganizationId == organizationId && x.Accepted != 1 && x.Rejected != 1).Skip(newOffset).Take(remainingLimit)
					.Include(x => x.RegisteredUser)
					.Include(x => x.Role)
					.ToListAsync();
				foreach (var inviteReq in invitedUserRequestList)
				{
					List<RoleDTO> roles = new List<RoleDTO>
					{
						await CreateRoleDTOAsync(inviteReq.Role)
					};
					userRoleDetails.Add(new UserRoleDetailsDTO()
					{
						user = new UserDTO()
						{
							userId = inviteReq?.RegisteredUser?.UserId ?? 0,
							firstname = inviteReq?.RegisteredUser?.Firstname ?? inviteReq.FirstName,
							lastname = inviteReq?.RegisteredUser?.Lastname ?? inviteReq.LastName,
							email = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(inviteReq.RegisteredUser?.UserId, organizationId) ?? inviteReq.EmailAddress,
						},
						roles = roles,
						status = Status.Pending.ToString(),
						date = inviteReq.CreatedDate,
					});
				}
			}
			return StatusCode(200, new
			{
				statusCode = 200,
				result = userRoleDetails,
				message = $"{userRoleDetails.Count} User Details!"
			});

		}
		[HttpPost]
		[Route("AddRoleForOganization")]
		public async Task<dynamic> AddRoleForOganizationAsync(RoleDTO role)
		{
			var isExist = await roleActions.IsExist(role.organizationId, role.roleId, role.name);
			if (isExist)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Role with same name already exist for this Organization!",
				});
			}
			if (role.roleId == 0)
			{
				// add role table
				Role roleObj = new Role()
				{
					Name = role.name,
					CreatedBy = role.created_by,
					Details = role.details,
					DisplayName = role.displayName,
					IsMandatory = role.isMandatory.ConvertToUlong(),
					OrganizationId = role.organizationId,
					CreatedDate = DateTime.UtcNow.ToString(),
				};
				await roleActions.AddAsync(roleObj);
				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = "Role Added!",
				});
			}
			else // for update
			{
				var existingRole = await roleActions.Get(role.roleId);
				existingRole.Name = role.name;
				existingRole.Details = role.details;
				existingRole.DisplayName = role.displayName;
				existingRole.IsMandatory = role.isMandatory.ConvertToUlong();
				await roleActions.UpdateAsync(existingRole);
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Role Updated!",
				});
			}

		}
		[HttpPost]
		[Route("AddRolesPermissions")]
		public async Task<dynamic> AddRolesPermissions(List<RolePermissionDTO> rolePermissionList)
		{
			if (rolePermissionList.Count > 0)
			{
				List<RolePermission> rolePermissionObjList = new List<RolePermission>();
				foreach (var x in rolePermissionList)
				{
					var permissions = await rolePermissionActions.GetAll().Where(n => n.RoleId == x.roleId).ToListAsync();
					if (permissions != null && permissions.Count > 0)
					{
						await rolePermissionActions.RemoveRangeAsync(permissions);
					}
					x.permissionIds.ForEach(n =>
					{
						rolePermissionObjList.Add(new RolePermission()
						{
							RoleId = x.roleId,
							PermissionId = n,
							CreatedBy = x.created_by,
							CreatedDate = DateTime.UtcNow.ToString(),
						});
					});
				}
				await rolePermissionActions.AddRangeAsync(rolePermissionObjList);

				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "Permission(s) Added!",
				});
			}
			else // for update
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Update Not implemented yet!",
				});
			}

		}
		[HttpPost]
		[Route("AddUserOganizationRole")]
		public async Task<dynamic> AddUserOganizationRole(UserOrganizationRoleDTO userOrganizationRole)
		{
			string msg = string.Empty;
			if (userOrganizationRole != null && userOrganizationRole.roleIds.Count > 0)
			{
				List<int> roleShouldntRemove = new List<int>();
				var orgRoles = await roleActions.GetAll().Where(x => x.OrganizationId == userOrganizationRole.organizationId).ToListAsync();
				var userOrganization = await userOrganizationActions.GetAll().Where(x => x.OrganizationId == userOrganizationRole.organizationId && x.UserId == userOrganizationRole.userId).Include(x=>x.UserOrganizationRoles).FirstOrDefaultAsync();
				if (userOrganization == null)
					return StatusCode(404, new
					{
						statusCode = 404,
						result = string.Empty,
						message = "Organization not Found!"
					});
				var linkedUser = await usernameLoginStudentActions.GetAll().AnyAsync(x => x.LinkParentId == userOrganizationRole.userId);
				if (linkedUser)
				{
					var parentRoleId = orgRoles.FirstOrDefault(x => x.Name == RoleType.Parent.ToString()).RoleId;

					roleShouldntRemove.Add(parentRoleId);
					msg = !userOrganizationRole.roleIds.Contains(parentRoleId) ? "Parent Role of this user can not change as Student is associated with this User!\n" : string.Empty;
					if (!string.IsNullOrEmpty(msg) && userOrganizationRole.roleIds.Count == 1)
					{
						return StatusCode(400, new
						{
							statusCode = 400,
							result = string.Empty,
							message = msg
						});
					}
				}
				var teamMember = await courseScheduleMemberActions.GetAll().AnyAsync(x => x.UserId == userOrganizationRole.userId && x.MemberType == (int)MemberType.Team);
				if (teamMember)
				{
					var studentRoleId = orgRoles.FirstOrDefault(x => x.Name == RoleType.Student.ToString()).RoleId;
					roleShouldntRemove.Add(studentRoleId);
					msg += userOrganizationRole.roleIds.Contains(studentRoleId) ? "Role of this user can not change to student as it is in additional team!\n" : string.Empty;
					if (!string.IsNullOrEmpty(msg) && userOrganizationRole.roleIds.Count == 1)
					{
						return StatusCode(400, new
						{
							statusCode = 400,
							result = string.Empty,
							message = msg
						});
					}
				}
				var teacher = await courseScheduleCourseDetailActions.GetAll().AnyAsync(x => x.TeacherId == userOrganizationRole.userId);
				if (teacher)
				{
					var teacherRoleId = orgRoles.FirstOrDefault(x => x.Name == RoleType.Teacher.ToString()).RoleId;
					roleShouldntRemove.Add(teacherRoleId);
					msg += !userOrganizationRole.roleIds.Contains(teacherRoleId) ? "Teacher Role of this user can not change as user is being used as Teacher !" : string.Empty;
					if (!string.IsNullOrEmpty(msg) && userOrganizationRole.roleIds.Count == 1)
					{
						return StatusCode(400, new
						{
							statusCode = 400,
							result = string.Empty,
							message = msg
						});
					}
				}
				var linkedUserOrganization = (await userOrganizationActions.GetAll().FirstOrDefaultAsync(x => x.LinkedUserOrganizationId == userOrganization.UserOrganizationId))?.UserOrganizationId;

				var roles = await userOrganizationRoleActions.GetAll().Where(x => (x.UserOrganizationId == userOrganization.UserOrganizationId || x.UserOrganizationId == linkedUserOrganization) && !roleShouldntRemove.Contains(x.RoleId)).ToListAsync();
				if (roles != null & roles.Count > 0)
				{
					await userOrganizationRoleActions.RemoveRangeAsync(roles);
				}
				List<UserOrganizationRole> userOrganizationRoleObjList = new List<UserOrganizationRole>();
				userOrganizationRole.roleIds.ForEach(x =>
				{
					if (!roleShouldntRemove.Contains(x))
					{

						userOrganizationRoleObjList.Add(new UserOrganizationRole()
						{
							RoleId = x,
							UserOrganizationId = userOrganization.UserOrganizationId,
							CreatedBy = userOrganizationRole.userId,
							CreatedDate = DateTime.UtcNow.ToString(),
						});
						if (linkedUserOrganization != null && linkedUserOrganization != 0)
						{
							userOrganizationRoleObjList.Add(new UserOrganizationRole()
							{
								RoleId = x,
								UserOrganizationId = (int)linkedUserOrganization,
								CreatedBy = userOrganizationRole.userId,
								CreatedDate = DateTime.UtcNow.ToString(),
							});
						}
					}
				});
				await userOrganizationRoleActions.AddRangeAsync(userOrganizationRoleObjList);

				// get roles and permissions
				var newRoles = userOrganization.UserOrganizationRoles.Select(x => x.RoleId).ToList();
				// get permission againsat those role
				var permssions = await rolePermissionActions.GetPermissionsByRoles(newRoles);
				var data = new UserPermssionsAndRolesInOrganization()
				{
					userId= userOrganizationRole.userId,
					organizationId = userOrganization.OrganizationId,
					permissions = permssions.Distinct().Select(x => new PermmsionsDetails()
					{
						permissionId = x.PermissionId,
						permissionName = x.Name
					}).ToList(),
					role = await userOrganizationRoleActions.GetRolesByUser(userOrganization.UserOrganizationId)
				};
				return StatusCode(200, new
				{
					statusCode = 200,
					result = data,
					message = string.IsNullOrEmpty(msg) ? "Role(s) Assigned to User Organization!" : msg,
				});
			}
			else // for update
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"At least one role should be selected!",
				});
			}

		}
		[HttpPost]
		[Route("InviteUserToOrganization")]
		public async Task<dynamic> InviteUserToOrganization(InviteUserModel inviteUserModel)
		{
			if (inviteUserModel != null)
			{
				// check if invitation is accepted or rejected
				var invitationExist = await userInviteActions.GetAll().AnyAsync(x => x.EmailAddress == inviteUserModel.email && x.Rejected != 1 && x.OrganizationId == inviteUserModel.organizationId);
				if (invitationExist)
				{
					return StatusCode(400, new
					{
						StatusCode = 400,
						result = string.Empty,
						message = "Invitation is either approved or pending!"
					});
				}
				// check if user exist in the users
				var user = await userActions.GetAll().FirstOrDefaultAsync(x => x.UserOrganizationEmails.Any(n => n.Email == inviteUserModel.email));
				// existing user
				if (user != null)
				{
					//if user is in same organization return error to user 
					var isUserFromSameOrganization = await userOrganizationActions.GetAll().AnyAsync(x => x.UserId == user.UserId && x.OrganizationId == inviteUserModel.organizationId && x.UserOrganizationRoles.Any(n => n.RoleId == inviteUserModel.roleId));
					if (isUserFromSameOrganization)
					{
						return StatusCode(400, new
						{
							statusCode = 400,
							result = string.Empty,
							message = $"User exists in the same Organization. Kindly change the role from User Role page!",
						});
					}
				}
				var organization = await organizationActions.Get(inviteUserModel.organizationId);
				var role = await roleActions.Get(inviteUserModel.roleId);

				// add invite
				UserInvite userInviteObj = new UserInvite()
				{
					EmailAddress = inviteUserModel.email,
					FirstName = inviteUserModel.firstName,
					LastName = inviteUserModel.lastName,
					CreatedBy = inviteUserModel.userId,
					CreatedDate = DateTime.UtcNow.ToString(),
					RegisteredUserId = user?.UserId ?? null,
					RoleId = inviteUserModel.roleId,
					OrganizationId = inviteUserModel.organizationId,
					IsInvitationSent = organization.IsApproved.ConvertToBool() == true ? 1 : ulong.MinValue,
				};
				await userInviteActions.AddAsync(userInviteObj);
				if (organization.IsApproved.ConvertToBool() == true)
				{
					// send invitation
					string link = _appSettings.Domain + $"/authentication/invitation?invitationId={userInviteObj.UserInviteId}";
					return await SendInviteToUser(userInviteObj, link,user, organization?.Name,role?.Name);
				}
				else
				{
					return StatusCodes(HttpStatusCode.OK, string.Empty, "Invite saved, will be sent when organization is approved!");

				}

			}
			else // for update
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = "Error Please contact Support!",
				});
			}

		}
		[HttpGet]
		[Route("GetInvitationData")]
		public async Task<dynamic> GetInvitationDataAsync(int invitationId)
		{
			var inviteData = await userInviteActions.GetAll()
				.Where(x => x.UserInviteId == invitationId)
				.Include(x => x.RegisteredUser)
				.Include(x => x.Organization)
				.Include(x => x.Role)
				.FirstOrDefaultAsync();
			if (inviteData == null)
			{
				return StatusCode(404, new
				{
					StatusCode = 404,
					result = string.Empty,
					messgae = "Error! Kindly contact Support."
				});
			}
			return StatusCode(200, new
			{
				StatusCode = 200,
				result = CreateInviteUserDetailModelDTO(inviteData),
				messgae = string.Empty
			});

		}
		[HttpPost]
		[Route("AcceptRejectInvitation")]
		public async Task<dynamic> AcceptRejectInvitationAsync(InvitationAcceptRejectDTO invitationAcceptReject)
		{
			string msg = string.Empty;
			var invitation = await userInviteActions.Get(invitationAcceptReject.invitationId);
			if (invitationAcceptReject.accpted.HasValue && invitationAcceptReject.accpted.Value)
			{
				invitation.Accepted = invitationAcceptReject.accpted.ConvertToUlong();
				msg = "Invitation Accepted!";
				var user = await userActions.Get(invitation.RegisteredUserId);
				// if new user 
				if (user == null)
				{
					User userObj = new User
					{
						Firstname = invitationAcceptReject.firstName,
						Lastname = invitationAcceptReject.lastName,
						//Email = invitation.EmailAddress,
						CreatedDate = DateTime.UtcNow.ToString(),
						Password = Encryption.Encode(invitationAcceptReject.password),
						Dob = invitationAcceptReject.dob,
						ContactNumber = invitationAcceptReject.contact,
					};
					await userActions.AddAsync(userObj);
					user = userObj;
				}

				// add email against organization
				UserOrganizationEmail emailObj = new UserOrganizationEmail()
				{
					UserId = user.UserId,
					Email = invitation.EmailAddress,
					OrganizationId = invitation.OrganizationId,
					IsVerified = 1,
					IsNotificationOn = 1,
					IsPrimary = 1,
				};
				await userOrganizationEmailActions.AddAsync(emailObj);

				// add user to userOrganization
				UserOrganization userOrganizationObj = new UserOrganization()
				{
					OrganizationId = invitation.OrganizationId,
					UserId = user.UserId,
					CreatedDate = DateTime.UtcNow.ToString(),
					CretaedBy = invitation.CreatedBy,
				};
				await userOrganizationActions.AddAsync(userOrganizationObj);

				// assign role
				UserOrganizationRole userOrganizationRoleObj = new UserOrganizationRole()
				{
					RoleId = invitationAcceptReject.roleId,
					UserOrganizationId = userOrganizationObj.UserOrganizationId,
					CreatedDate = DateTime.UtcNow.ToString(),
					CreatedBy = invitation.CreatedBy,
				};
				await userOrganizationRoleActions.AddAsync(userOrganizationRoleObj);
			}
			else
			{
				invitation.Rejected = invitationAcceptReject.rejected.ConvertToUlong();
				msg = "Invitation Rejected!";
			}
			await userInviteActions.UpdateAsync(invitation);
			return StatusCode(200, new
			{
				StatusCode = 200,
				reuslt = string.Empty,
				message = msg
			});

		}
		[HttpGet]
		[Route("CheckInvitation")]
		public async Task<dynamic> CheckInvitationAsync(int invitationId)
		{
			var inviteData = await userInviteActions.Get(invitationId);

			if (inviteData == null)
			{
				return StatusCode(404, new
				{
					StatusCode = 404,
					result = string.Empty,
					messgae = "Error! Kindly contact Support."
				});
			}
			var isAccepted = inviteData.Accepted.ConvertToBool();
			var isRejected = inviteData.Rejected.ConvertToBool();
			return StatusCode(200, new
			{
				StatusCode = 200,
				result = isAccepted,
				messgae = $"Already  {(isAccepted == true ? "Accepted" : isRejected == true ? "Rejected" : "Pending")}",
			});

		}
		[HttpDelete]
		[Route("DeleteRole")]
		public async Task<dynamic> DeleteRoleAsync(int roleId)
		{
			var users = await userOrganizationRoleActions.GetAll().Where(x => x.RoleId == roleId)
				.Include(x => x.UserOrganization).ThenInclude(x => x.User).Select(x => x.UserOrganization.User.Firstname + x.UserOrganization.User.Lastname)
				.ToListAsync();
			var userInvites = await userInviteActions.GetAll().Where(x => x.RoleId == roleId ).Select(x => x.FirstName + x.LastName).ToListAsync();			
            if (users.Count > 0 || userInvites.Count > 0)
			{
				users.AddRange(userInvites);
                // if role is assigned to any user organization
                return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Role is assigned to following User(s) {string.Join(',', users)}",
				});
			}
			var userRequests = await userRequestActions.GetAll().AnyAsync(x => x.RoleId == roleId);
			if (userRequests)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"Role is used is User Requests",
				});
			}
			// if role is not assigned
			// delete role from role_permission table
			var rolePermssions = await rolePermissionActions.GetAll().Where(x => x.RoleId == roleId).ToListAsync();
			await rolePermissionActions.RemoveRangeAsync(rolePermssions);
			// delete role from role table
			var role = await roleActions.Get(roleId);
			if (role != null)
			{
				await roleActions.RemoveAsync(role);

				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = "Role has been deleted!",
				});
			}
			return StatusCode(400, new
			{
				statusCode = 400,
				result = string.Empty,
				message = "No Role Deleted!",
			});

		}
		[HttpGet]
		[Route("GetUserRolePermissionDetails")]
		public async Task<dynamic> GetUserRolePermissionDetails(int userId, int organizationId)
		{
			var user = await userActions.Get(userId);
			if (user == null)
			{
				// if role is assigned to any user organization
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"User Not Found!",
				});
			}
			var userRoles = await userOrganizationActions.GetAll().Where(x => x.UserId == userId && x.OrganizationId == organizationId && x.Organization.IsDeleted != 1 && x.UserOrganizationRoles.Any(m => m.UserOrganizationId == x.UserOrganizationId))
				.Include(x => x.UserOrganizationRoles).ThenInclude(x => x.Role)
				.Select(x => x.UserOrganizationRoles.Select(x => x.Role).ToList())
				.FirstOrDefaultAsync();
			if (userRoles == null || userRoles.Count == 0)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = string.Empty,
					message = $"No Roles Found!",
				});
			}
			var userRolePermissionData = new UserRolePermissionDetailsDTO()
			{
				organizationId = organizationId,
				userId = userId,
				RolesDetails = new List<RolesDetails>(),
			};

			foreach (var userRole in userRoles)
			{
				List<RolesDetails> RolesDetails = new List<RolesDetails>();
				RolesDetails RolesDetail = new RolesDetails()
				{
					role = new RoleDTO()
					{
						roleId = userRole.RoleId,
						name = userRole.Name,
						details = userRole.Details,
						displayName = userRole.DisplayName,
					},
					permissions = new List<PermissionDTO>(),
				};
				var permissions = await rolePermissionActions.GetPermissionsByRoles(new List<int>() { userRole.RoleId });
				if (permissions != null && permissions.Count > 0)
				{
					var permissionDetails = new List<PermissionDTO>();
					foreach (var permission in permissions)
					{
						RolesDetail.permissions.Add(new PermissionDTO()
						{
							description = permission.Description,
							display_name = permission.DisplayName,
							name = permission.Name,
							permissionId = permission.PermissionId
						});
					}
				}
				RolesDetails.Add(RolesDetail);
				userRolePermissionData.RolesDetails.AddRange(RolesDetails);


			}
			return StatusCode(200, new
			{
				statusCode = 200,
				result = userRolePermissionData,
				message = $"Data Found!",
			});

		}
		[NonAction]
		private async Task<RoleDTO> CreateRoleDTOAsync(Role role, int? userId = null)
		{
			return new RoleDTO()
			{
				roleId = role.RoleId,
				name = role.Name,
				displayName = role.DisplayName,
				details = role.Details,
				isMandatory = role.IsMandatory.ConvertToBool(),
				created_by = role.CreatedBy,
				organizationId = role.OrganizationId,
				isRoleInUse = (userId != null && userId != 0) && await IsRoleInUseAsync(role.Name, userId),
			};
		}
		[NonAction]
		private PermissionDTO CreatePermissionDTO(Permission permission)
		{
			return new PermissionDTO()
			{
				permissionId = permission.PermissionId,
				display_name = permission.DisplayName,
				name = permission.Name,
				description = permission.Description,
			};
		}
		[NonAction]
		private async Task<RolePermissionDetailsDTO> CreateRolePermissionDetailsDTOAsync(RolePermission rolePermission)
		{
			return new RolePermissionDetailsDTO()
			{
				role = await CreateRoleDTOAsync(rolePermission.Role),
				roleId = rolePermission.RoleId,
				permission = CreatePermissionDTO(rolePermission.Permission),
				permissionId = rolePermission.PermissionId,
				created_by = rolePermission.CreatedBy,
			};
		}
		[NonAction]
		private async Task<UserRoleDetailsDTO> CreateUserRoleDetailsDTOAsync(User user, List<Role> userRoles, bool? isActive,int organizationId)
		{
			List<RoleDTO> roles = new List<RoleDTO>();
			foreach (var role in userRoles)
			{
				roles.Add(await CreateRoleDTOAsync(role, user.UserId));

			}
			return new UserRoleDetailsDTO()
			{
				user = new UserDTO()
				{
					userId = user.UserId,
					firstname = user.Firstname,
					lastname = user.Lastname,
					email = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(user.UserId, organizationId) ,
					contact = user.ContactNumber,
					dob = user.Dob,
					image = user.Image,
				},
				roles = roles,
				date = user.CreatedDate,
				isActive = isActive,
			};
		}
		[NonAction]
		private async Task<bool> IsRoleInUseAsync(string roleName, int? userId)
		{
			bool isRoleInUse = false;
			switch (roleName)
			{
				case nameof(RoleType.Student):
					{
						isRoleInUse = await usernameLoginStudentActions.GetAll().AnyAsync(x => x.UserId == userId);
						break;
					}
				case nameof(RoleType.Parent):
					{
						isRoleInUse = await usernameLoginStudentActions.GetAll().AnyAsync(x => x.LinkParentId == userId);
						break;
					}
				case nameof(RoleType.Teacher):
					{
						isRoleInUse = await courseScheduleCourseDetailActions.GetAll().AnyAsync(x => x.TeacherId == userId);

						break;
					}
				default:
					{
						isRoleInUse = false;
						break;
					}
			}
			return isRoleInUse;
		}
		[NonAction]
		private InviteUserDetailModelDTO CreateInviteUserDetailModelDTO(UserInvite userInviteObj)
		{
			return new InviteUserDetailModelDTO()
			{
				firstName = userInviteObj?.RegisteredUser?.Firstname ?? userInviteObj.FirstName,
				lastName = userInviteObj?.RegisteredUser?.Lastname ?? userInviteObj.LastName,
				email = userInviteObj.EmailAddress,
				organizationId = userInviteObj.OrganizationId,
				organizationName = userInviteObj?.Organization?.Name,
				user = userInviteObj.RegisteredUserId != null && userInviteObj.RegisteredUserId != 0 ? new UserDTO()
				{
					userId = userInviteObj.RegisteredUserId ?? 0,
					firstname = userInviteObj?.RegisteredUser?.Firstname,
					lastname = userInviteObj?.RegisteredUser?.Lastname,
				} : null,
				role = new RoleDTO()
				{
					roleId = userInviteObj.RoleId,
					name = userInviteObj.Role?.Name,
					displayName = userInviteObj.Role?.DisplayName,
				},
			};
		}
	}
}

