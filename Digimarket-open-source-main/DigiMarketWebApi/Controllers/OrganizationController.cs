using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using static System.Net.Mime.MediaTypeNames;
using DbRepository.Modules;
using System.Data;
using System.Net;

namespace DigiMarketWebApi.Controllers
{

	public class OrganizationController : BaseController
	{
		private readonly OrganizationRequestActions organizationRequestActions;
		private readonly PermissionActions permissionActions;
		private readonly RoleActions roleActions;
		private readonly RolePermissionActions rolePermissionActions;
		private readonly OrganizationActions organizationActions;
		private readonly UserOrganizationRoleActions userOrganizationRoleActions;
		private readonly UserActions userActions;
		private readonly UserOrganizationActions userOrganizationActions;
		private readonly IMailRepo mailRepo;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly Appsettings _appSettings;
		private readonly UserInviteActions userInviteActions;

		public OrganizationController(IOptions<Appsettings> appSettings, OrganizationRequestActions organizationRequestActions, PermissionActions permissionActions, RoleActions roleActions, RolePermissionActions rolePermissionActions, OrganizationActions organizationActions, UserOrganizationRoleActions userOrganizationRoleActions, UserActions userActions, UserOrganizationActions userOrganizationActions, IMailRepo _mailRepo, UserOrganizationEmailActions userOrganizationEmailActions, UserInviteActions userInviteActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.organizationRequestActions = organizationRequestActions;
			this.permissionActions = permissionActions;
			this.roleActions = roleActions;
			this.rolePermissionActions = rolePermissionActions;
			this.organizationActions = organizationActions;
			this.userOrganizationRoleActions = userOrganizationRoleActions;
			this.userActions = userActions;
			this.userOrganizationActions = userOrganizationActions;
			mailRepo = _mailRepo;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			_appSettings = appSettings.Value;
			this.userInviteActions = userInviteActions;
		}

		[HttpGet]
		[Route("GetOrganizations")]
		public async Task<dynamic> GetOrganizationsAsync(int userID, bool isParent = false)
		{
			UserOrganizationDTO userOrganizationObj = new UserOrganizationDTO();
			List<UserOrganizationGetModel> organizations = new List<UserOrganizationGetModel>();
			var user = await userActions.Get(userID);
			UserDetailDTO newUser = new UserDetailDTO();

			var userorg = await userOrganizationActions.GetAll().Where(x => x.UserId == userID).Include(x => x.UserOrganizationRoles).ToListAsync();
			if (isParent)
			{
				var userOrgIds = userorg.Select(x => x.UserOrganizationId).ToList();
				var organizationRole = await userOrganizationRoleActions.GetAll().Where(x => (x.Role.Name == RoleType.Parent.ToString() || x.Role.Name == RoleType.Owner.ToString()) && userOrgIds.Contains(x.UserOrganizationId)).Select(x => x.UserOrganizationId).ToListAsync();
				userorg = userorg.Where(x => organizationRole.Contains(x.UserOrganizationId)).ToList();
			}
			if (user?.IsPlatformAdmin != 1 && userorg != null && userorg.Count > 0)
			{
				foreach (var item in userorg)
				{
					item.IsSelected = userorg.Count() == 1 ? 1 : item.IsSelected;

					if (item.IsSelected.ConvertToBool() == true && item.IsLinked.ConvertToBool() == true)
					{
						// old user + new user
						var newUserId = (await userOrganizationActions.GetAll().Where(x => x.UserOrganizationId == item.LinkedUserOrganizationId).Include(x => x.UserOrganizationRoles).Select(x => x.UserId).FirstOrDefaultAsync());
						if (newUserId != 0)
						{
							userOrganizationObj.newUser = await CreateUserModelAsync(item, (int)newUserId);
						}
					}

					var orgs = await organizationActions.GetAll().Where(x => x.OrganizationId == item.OrganizationId).ToListAsync();
					if (orgs != null)
					{

						foreach (var org in orgs)
						{

							organizations.Add(await CreateUserOrganizationDataAsync(org, userID, item.IsActive.ConvertToBool(), item.IsSelected));
						}
					}

				}
			}
			else if (user.IsPlatformAdmin != null)
			{
				var orgs = await organizationActions.GetAll().ToListAsync();
				if (orgs != null && orgs.Count > 0)
				{
					foreach (var org in orgs)
					{

						organizations.Add(await CreateUserOrganizationDataAsync(org, userID));
					}
				}
			}
			if (organizations != null)
			{
				userOrganizationObj.organizations = organizations;
				return StatusCode(200, new
				{
					statusCode = 200,
					result = userOrganizationObj,
					message = $"{organizations.Count} Organization(s) Found !"
				});
			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "Organizations Not Found Against This User"
				});
			}


			//{
			//    return StatusCode(404, new
			//    {
			//        statusCode = 404,
			//        result = "",
			//        message = "Organizations Not Found Against This User"
			//    });
			//}
		}
		[HttpGet]
		[Route("GetSingleOrganization")]
		public async Task<dynamic> GetSingleOrganizationAsync(int orgId)
		{
			var organization = await organizationActions.GetAll().Where(x => x.OrganizationId == orgId).FirstOrDefaultAsync();
			if (organization != null)
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = organization,
					message = "Organization Found"
				});
			}
			else
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "Organization Not Found !"
				});

			}
		}
		[HttpGet]
		[Route("ActivateOrganization")]
		// public dynamic ActivateOrganization(string userId, string orgId, string isActive)
		public async Task<dynamic> ActivateOrganizationAsync(int userId, int orgId)
		{
			UserDetailDTO newUser = new UserDetailDTO();
			UserDetailDTO oldUser = new UserDetailDTO();
			var list = await userOrganizationActions.GetAll().Where(x => x.UserId == userId).ToListAsync();
			foreach (var org in list)
			{
				org.IsSelected = 0;
				await userOrganizationActions.UpdateAsync(org);

			}
			var userOrganizations = await userOrganizationActions.GetAll().Where(x => x.OrganizationId == orgId && x.UserId == userId)
				.Include(x => x.UserOrganizationRoles).FirstOrDefaultAsync();
			if (userOrganizations != null)
			{
				userOrganizations.IsSelected = 1;
				await userOrganizationActions.UpdateAsync(userOrganizations);


				if (userOrganizations.IsLinked.ConvertToBool() == true)
				{
					// old user + new user
					var newUserId = (await userOrganizationActions.GetAll().Where(x => x.UserOrganizationId == userOrganizations.LinkedUserOrganizationId).Include(x => x.UserOrganizationRoles).Select(x => x.UserId).FirstOrDefaultAsync());
					if (newUserId != 0)
					{
						newUser = await CreateUserModelAsync(userOrganizations, (int)newUserId);
						if (newUser == null)
						{
							return StatusCode(404, new
							{
								statusCode = 404,
								result = "",
								message = "Linked User not found !"
							});
						}
					}
				}
				oldUser = await CreateUserModelAsync(userOrganizations, userId);
				return StatusCode(200, new
				{
					statusCode = 200,
					result = new MultipleUsersDTO()
					{
						newUser = newUser,
						oldUser = oldUser,
					},
					message = " Organization Activated !"
				});
			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Organization ! Doesn't Exist !"
				});
			}
		}
		[NonAction]
		public async Task<UserDetailDTO> CreateUserModelAsync(UserOrganization userOrganizations, int userId)
		{
			var userExist = userActions.GetAll().Where(x => x.UserId == userId)
						.Include(x => x.UserOrganizationUsers).ThenInclude(x => x.UserOrganizationRoles)
						.FirstOrDefault();
			if (userExist == null)
			{
				return null;
			}
			List<UserPermssionsByOrganization> userDataList = new List<UserPermssionsByOrganization>();

			// get roles for each organization
			var roles = userOrganizations.UserOrganizationRoles.Select(x => x.RoleId).ToList();
			// get permission againsat those role
			var permssions = await rolePermissionActions.GetPermissionsByRoles(roles);

			var permissions = permssions.Distinct().Select(x => new PermmsionsDetails()
			{
				permissionId = x.PermissionId,
				permissionName = x.Name
			}).ToList();
			var userResult = new UserDetailDTO()
			{
				userId = userExist.UserId,
				firstName = userExist.Firstname,
				lastName = userExist.Lastname,
				email = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(userExist.UserId, userOrganizations.OrganizationId),
				contactNumber = userExist.ContactNumber,
				dob = userExist.Dob,
				isRoot = userExist.IsRoot.ConvertToBool(),
				parentId = userExist.ParentId,
				permissions = permissions ?? new List<PermmsionsDetails>(),
				image = userExist.Image,
				roles = await userOrganizationRoleActions.GetRolesByUser(userOrganizations.UserOrganizationId)

			};
			return userResult;
		}
		[HttpPost]
		[Route("CreateOrganization")]
		public async Task<dynamic> CreateOrganizationAsync(CreateOrganizationModel createOrganizationModel)
		{
			var existingOrg = await organizationActions.GetAll().Where(x => x.Name.ToLower().Trim() == createOrganizationModel.name.ToLower().Trim()).FirstOrDefaultAsync();
			if (existingOrg == null)
			{
				var user = await userActions.Get(createOrganizationModel.userId);
				var userEmail = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(user.UserId, createOrganizationModel.currentOrganizationId);
				Organization organization = new Organization();
				var userId = 0;
				if (user != null)
				{
					userId = user.UserId;
					organization.EmailAddress = userEmail;
				}
				else
				{
					return StatusCode(404, new
					{
						statusCode = 404,
						result = "",
						message = "User Not Found !",
					});
				}
				var existingOrgEmail = organizationActions.GetAll().Where(x => x.Name == createOrganizationModel.name && x.EmailAddress == organization.EmailAddress).FirstOrDefault();
				if (existingOrgEmail == null)
				{
					organization.Name = createOrganizationModel.name;
					organization.EndPoint = createOrganizationModel.endPoint;
					organization.AboutOrganziation = createOrganizationModel.aboutOrganziation;
					organization.IsActive = createOrganizationModel.isActive.ConvertToUlong();
					organization.Logo = createOrganizationModel.logo;
					organization.Country = createOrganizationModel.Country;
					organization.Address = createOrganizationModel.Address;
					organization.ContactNumber = createOrganizationModel.ContactNumber;
					organization.TypeOfOrganization = (int)createOrganizationModel.TypeOfOrganization;
					organization.Creator = userId;

					await organizationActions.AddAsync(organization);

					// add email against organization
					UserOrganizationEmail emailObj = new UserOrganizationEmail()
					{
						UserId = userId,
						Email = userEmail,
						OrganizationId = organization.OrganizationId,
						IsVerified = 1,
						IsNotificationOn = 1,
						IsPrimary = 1,
					};
					await userOrganizationEmailActions.AddAsync(emailObj);


					UserOrganization userOrganization = new UserOrganization();
					userOrganization.UserId = userId;
					userOrganization.CreatedDate = DateTime.UtcNow.ToString();
					userOrganization.CretaedBy = userId;
					userOrganization.OrganizationId = organization.OrganizationId;
					await userOrganizationActions.AddAsync(userOrganization);

					// create role for the organization 
					int roleId = 0;
					var roles = Enum.GetValues(typeof(RoleType)).Cast<RoleType>().ToList();
					foreach (var roleType in roles)
					{
						Role role = new Role()
						{
							Name = roleType.ToString(),
							DisplayName = roleType.GetRoleDisplayName(),
							Details = roleType.GetDescription(),
							IsMandatory = 1,
							OrganizationId = organization.OrganizationId,
							CreatedBy = userId,
							CreatedDate = DateTime.UtcNow.ToString(),
						};
						await roleActions.AddAsync(role);
						if (roleType == RoleType.Owner)
						{
							roleId = role.RoleId;
						}
						await rolePermissionActions.AssignPermissionsToRole(role.RoleId, roleType, userId);
					}

					// assign role and permssions
					UserOrganizationRole userOrganizaionRole = new UserOrganizationRole()
					{
						RoleId = roleId,
						UserOrganizationId = userOrganization.UserOrganizationId,
						CreatedDate = DateTime.UtcNow.ToString(),
						CreatedBy = userId,
					};
					await userOrganizationRoleActions.AddAsync(userOrganizaionRole);

					return StatusCode(200, new
					{
						statusCode = 200,
						result = string.Empty,
						message = "Organization Added Successfully.",
					});
				}
				else
				{
					return StatusCode(404, new
					{
						statusCode = 404,
						result = "",
						message = "Organization Name and Email Already Exists.",
					});
				}

			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "Organization Already Exists.",
				});
			}


		}
		[HttpGet]
		[Route("GetOrganization")]
		public async Task<dynamic> GetOrganizationAsync(string terms, int offset, int limit, int? userId, int? type, string country)
		{
			limit = limit == 0 ? 10 : limit; // default limit is 10 
			List<UserOrganizationGetModel> organizations = new List<UserOrganizationGetModel>();
			var user = await userActions.Get(userId);
			// predicate for filtration
			terms = terms?.Trim()?.ToLower();
			country = country?.Trim()?.ToLower();
			Expression<Func<Organization, bool>> wherePredicate = x =>
							x.IsDeleted != 1 && x.IsApproved == 1 &&
							//((user != null && user.IsPlatformAdmin.ConvertToBool() == true) && (terms == null || x.Name.Trim().ToLower().Contains(terms) || x.AboutOrganziation.Trim().ToLower().Contains(terms)))
							(terms == null || x.Name.Trim().ToLower().Contains(terms) || x.AboutOrganziation.Trim().ToLower().Contains(terms))
							&& (type == null || x.TypeOfOrganization == type)
							&& (country == null || x.Country.Trim().ToLower().Contains(country))

							&& x.IsApproved == 1 /*&& (userId == null || userId == 0 || x.Creator != userId)*/;
			var orgs = await organizationActions.GetAll().Where(wherePredicate).Skip(offset).Take(limit).ToListAsync();

			if (orgs != null)
			{
				foreach (var org in orgs)
				{
					organizations.Add(await CreateUserOrganizationDataAsync(org, user?.UserId));
				}
				if (organizations != null)
				{
					return StatusCode(200, new
					{
						statusCode = 200,
						result = organizations,
						message = $"{organizations.Count} Organizations Found !"
					});
				}
				else
				{
					return StatusCode(404, new
					{
						statusCode = 404,
						result = "",
						message = "Organizations Not Found Against"
					});
				}
			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "Organizations Not Found Against"
				});
			}
		}
		[NonAction]
		private async Task<UserOrganizationGetModel> CreateUserOrganizationDataAsync(Organization org, int? userId, bool? isActive = true, ulong? isSelected = 0)
		{
			return new UserOrganizationGetModel()
			{

				AboutOrganziation = org.AboutOrganziation,
				OrganizationId = org.OrganizationId,
				Name = org.Name,
				EndPoint = org.EndPoint,
				EmailAddress = org.EmailAddress,
				Logo = org.Logo,
				IsApproved = org.IsApproved,
				IsRejected = org.IsRejected,
				ApprovedBy = org.ApprovedBy,
				RejectedBy = org.RejectedBy,
				IsSelected = isSelected == 1,
				Address = org.Address,
				ContactNumber = org.ContactNumber,
				Country = org.Country,
				TypeOfOrganization = org.TypeOfOrganization,
				Creator = org.Creator,
				isUserExistInOrganization = (userId != null || userId != 0) && await isUserExistInOrganizationAsync(org.OrganizationId, userId),
				IsActive = isActive

			};
		}
		[NonAction]
		private async Task<bool> isUserExistInOrganizationAsync(int organizationId, int? userId)
		{
			return await userOrganizationActions.GetAll().AnyAsync(x => x.OrganizationId == organizationId && x.UserId == userId);
		}

		[HttpPost]
		[Route("SetOrganizationApprovalStatus")]
		public async Task<dynamic> SetOrganizationApprovalStatusAsync(OrganizationApprovalDTO organization)
		{
			var orgDbData = organizationActions.GetAll().Where(x => x.OrganizationId == organization.OrganizationId)
				.Include(x => x.UserOrganizations).ThenInclude(x => x.User).ThenInclude(x=>x.UserOrganizationUsers)
				.Include(x => x.UserOrganizations).ThenInclude(x => x.User).ThenInclude(x=>x.UserOrganizationEmails)
				.Include(x => x.UserOrganizations).ThenInclude(x => x.UserOrganizationRoles)
				.Include(x=>x.Roles).ThenInclude(x=>x.RolePermissions)
				.Include(x=>x.UserInvites)
				.FirstOrDefault();
			string msg = string.Empty;
			if (orgDbData == null)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Organization request Does Not Exists ");
			}
			else
			{
				if (organization.IsApproved == true)
				{
					orgDbData.IsApproved = 1;
					orgDbData.ApprovedBy = organization.CreatedBy;
					await organizationActions.UpdateAsync(orgDbData);
				}
				else if (organization.IsRejected == true)
				{
					orgDbData.IsRejected = 1;
					orgDbData.Reason = organization.Reason;
					orgDbData.RejectedBy = organization.CreatedBy;

					#region REMOVE ALL THE DATA LINKED TO ORGANIZATION
					// delete all the data related to this organization

					// userid
					
					// pending invitations
					var userInvites = orgDbData.UserInvites?.Where(x=>x.IsInvitationSent != ulong.MaxValue).ToList();
					if (userInvites?.Count > 0)
						await userInviteActions.RemoveRangeAsync(userInvites, false);
					
					// organization request 
					var orgRequest = await organizationRequestActions.GetAll().Where(x=>x.OrganizationId == orgDbData.OrganizationId).ToListAsync();
					if (orgRequest?.Count > 0)
						await organizationRequestActions.RemoveRangeAsync(orgRequest, false);

                    // organization roles assigned to 
                    var userOrgsRoles = orgDbData.UserOrganizations?.FirstOrDefault()?.UserOrganizationRoles.ToList();
					if (userOrgsRoles?.Count >0)
						await userOrganizationRoleActions.RemoveRangeAsync(userOrgsRoles, false);					

					//permissions assinged to the roles
					var rolesPermissions = orgDbData.Roles.SelectMany(x=>x.RolePermissions).ToList();
					if (rolesPermissions?.Count > 0)
						await rolePermissionActions.RemoveRangeAsync(rolesPermissions, false);
					
					// roles in the organization 
					var orgRoles = orgDbData.Roles.ToList();
					if (orgRoles?.Count > 0)
						await roleActions.RemoveRangeAsync(orgRoles);
					
					// user organization 
					var userOrgs = orgDbData.UserOrganizations.ToList();
					if (userOrgs?.Count > 0)
						await userOrganizationActions.RemoveRangeAsync(userOrgs,false);
					
					// user organization emails
					var userOrgsEmails = orgDbData.UserOrganizations.FirstOrDefault()?.User?.UserOrganizationEmails.Where(x=>x.OrganizationId == organization.OrganizationId)?.ToList();
					if (userOrgsEmails?.Count > 0)
						await userOrganizationEmailActions.RemoveRangeAsync(userOrgsEmails,false);

					// user  
					var user = orgDbData.UserOrganizations.FirstOrDefault()?.User?.UserOrganizationUsers?.ToList();
					if (user?.Count == 1)
						await userActions.RemoveAsync(user?.FirstOrDefault()?.User,false);
					
					// organization 
					await organizationActions.RemoveAsync(orgDbData);
					#endregion

				}

				string inviteLink = _appSettings.Domain + $"/dashboard/user-roles";
				string link = _appSettings.Domain + $"/dashboard?orgId={organization.OrganizationId}";

				// Key Value Pair to replace in the body
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
				{
					new KeyValuePair<string, string>("[firstName]", orgDbData.UserOrganizations?.FirstOrDefault()?.User?.Firstname),
					new KeyValuePair<string, string>("[lastName]", orgDbData.UserOrganizations?.FirstOrDefault()?.User?.Lastname),
					new KeyValuePair<string, string>("[orgName]", orgDbData.Name),
					new KeyValuePair<string, string>("[rejectionReason]", orgDbData.Reason),
					new KeyValuePair<string, string>("[link]", link),
					new KeyValuePair<string, string>("[inviteLink]", inviteLink)
				};
				try
				{
					await mailRepo.SendEmail(orgDbData.EmailAddress, organization.IsApproved ? EmailType.Organization_Registration_Approved : EmailType.Organization_Registration_Rejected, replacementDict);
				}
				catch (Exception)
				{
					msg = "Email not sent!";
				}
				if (organization.IsApproved)
				{
					// get all invites
					var invites = await userInviteActions.GetAll().Where(x => x.OrganizationId == organization.OrganizationId && x.IsInvitationSent != ulong.MaxValue).Include(x => x.RegisteredUser).Include(x => x.Role).ToListAsync();
					foreach (var invite in invites)
					{
						// send invitation
						string invitationLink = _appSettings.Domain + $"/authentication/invitation?invitationId={invite.UserInviteId}";
						await SendInviteToUser(invite, invitationLink, invite.RegisteredUser, orgDbData.Name, invite.Role?.Name);

						invite.IsInvitationSent = ulong.MaxValue;
						await userInviteActions.UpdateAsync(invite);
					}
				}
			}
			return StatusCodes(HttpStatusCode.OK, msg, organization.IsApproved ? "Approved successfully" : "Rejected successfully");


		}

		[HttpGet]
		[Route("GetOrganizationsForApproval")]
		public async Task<dynamic> GetOrganizationRequestsAsync(int offset, int limit)
		{
			limit = limit == 0 ? 10 : limit;
			var orgObj = await organizationActions.GetAll().Where(x => x.IsApproved == null && x.IsRejected == null).Skip(offset).Take(limit)
				.Include(x => x.UserOrganizations).ThenInclude(x => x.User).ToListAsync();

			if (orgObj == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = "",
					message = "Organization Requests Not Found!"
				});
			}
			else
			{
				List<GetOrganizationApprovalDTO> listorgs = new List<GetOrganizationApprovalDTO>();
				orgObj.ForEach(orgs =>
				{
					listorgs.Add(new GetOrganizationApprovalDTO()
					{
						aboutOrganziation = orgs.AboutOrganziation,
						Address = orgs.Address,
						endPoint = orgs.EndPoint,
						ContactNumber = orgs.ContactNumber,
						Email = orgs.EmailAddress,
						logo = orgs.Logo,
						TypeOfOrganization = (int)orgs.TypeOfOrganization,
						OrganizationName = orgs.Name,
						Firstname = orgs.UserOrganizations.FirstOrDefault()?.User?.Firstname,
						Lastname = orgs.UserOrganizations.FirstOrDefault()?.User?.Lastname,
						Country = orgs.Country,
						organizationId = orgs.OrganizationId,
					});
				});
				int newOffset = 0;
				int remainingLimit = limit;
				if (orgObj.Count() == 0)
				{
					var total_OrgCount = await organizationActions.GetAll().CountAsync(x => x.IsApproved == null && x.IsRejected == null);
					newOffset = offset - total_OrgCount;
				}
				else
				{
					remainingLimit = limit - orgObj.Count();
				}
				var orgEditRequestList = await organizationRequestActions.GetAll().Where(x => x.IsEditRequest == 1 && x.OrganizationIsRejected != 1 && x.OrganizationIsApproved != 1).Skip(newOffset).Take(remainingLimit).ToListAsync();
				orgEditRequestList.ForEach(orgReq =>
				{

					listorgs.Add(new GetOrganizationApprovalDTO()
					{
						aboutOrganziation = orgReq.About,
						Address = orgReq.Address,
						ContactNumber = orgReq.ContactNumber,
						logo = orgReq.Logo,
						OrganizationName = orgReq.OrganizationName,
						Country = orgReq.Country,
						organizationId = orgReq.OrganizationId,
						IsEditRequest = true,
						organizationRequestId = orgReq.OrganizationRequestId,
						TypeOfOrganization = (int)orgReq.OrganizationType,
					});
				});

				return StatusCode(200, new
				{
					statusCode = 200,
					result = listorgs,
					message = $"{listorgs.Count} Organization Request Found!"
				});
			}
		}
		[HttpDelete]
		[Route("DeleteOrganization")]
		public async Task<dynamic> DeleteOrganization(int organizationId)
		{
			var organization = await organizationActions.Get(organizationId);
			if (organization == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = "",
					message = "Organization Not Found!"
				});
			}
			organization.IsDeleted = 1;
			await organizationActions.UpdateAsync(organization);
			return StatusCode(200, new
			{
				statusCode = 200,
				result = "",
				message = "Organization Delete!"
			});

		}
	}
}
