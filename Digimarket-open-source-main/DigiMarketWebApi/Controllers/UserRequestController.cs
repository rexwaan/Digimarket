using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Microsoft.EntityFrameworkCore;
using DbRepository.Modules;

namespace DigiMarketWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserRequestController : ControllerBase
	{
		private readonly IMailRepo mailRepo;
		private readonly Appsettings _appSettings;
		private readonly UserActions userActions;
		private readonly OrganizationActions organizationActions;
		private readonly RoleActions roleActions;
		private readonly UserRequestActions userRequestActions;
		private readonly UserOrganizationActions userOrganizationActions;
		private readonly UserOrganizationRoleActions userOrganizationRoleActions;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;

		public UserRequestController(UserOrganizationRoleActions userOrganizationRoleActions, UserActions userActions, IMailRepo _mailRepo, IOptions<Appsettings> appSettings, OrganizationActions organizationActions, RoleActions roleActions, UserRequestActions userRequestActions, UserOrganizationActions userOrganizationActions, UserOrganizationEmailActions userOrganizationEmailActions)
		{
			this.userOrganizationRoleActions = userOrganizationRoleActions;
			this.userActions = userActions;
			mailRepo = _mailRepo;
			_appSettings = appSettings.Value;
			this.organizationActions = organizationActions;
			this.roleActions = roleActions;
			this.userRequestActions = userRequestActions;
			this.userOrganizationActions = userOrganizationActions;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
		}
		[HttpPost]
		[Route("AddUserRequest")]
		public async Task<dynamic> AddUserRequestAsync(UserRequestDTO userRequest)
		{
			// check email
			var user = await userActions.Get((int)userRequest.userId);
			var existingEmail = await userOrganizationEmailActions.GetAll().Where(x => x.Email == userRequest.email).FirstOrDefaultAsync();
			if ((userRequest.userId == null || userRequest.userId == 0) && existingEmail !=null)
			{
				var organization = await organizationActions.Get(userRequest.organizationId);
				var role = await roleActions.Get((int)userRequest.roleId);
				// Key Value Pair to replace in the body
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[firstName]", user?.Firstname ?? userRequest.firstName),
							new KeyValuePair<string, string>("[lastName]", user?.Lastname ?? userRequest.lastName),
							new KeyValuePair<string, string>("[orgName]", organization?.Name),
							new KeyValuePair<string, string>("[roleName]", role.Name),
							new KeyValuePair<string, string>("[link]", $"{_appSettings.Domain}/adduserrequest?userId={existingEmail.UserId}&email={userRequest.email}&organizationId={organization.OrganizationId}&roleId={role.RoleId}")
						};
				try
				{
					await mailRepo.SendEmail(userRequest.email, EmailType.User_Membership_Request_Confirmation, replacementDict);
					return StatusCode(200, new
					{
						statusCode = 200,
						message = "Email Sent!"
					});
				}
				catch (Exception)
				{
					throw;
				}
			}
			// check user if given in the request
			if (userRequest.userId != null && userRequest.userId != 0 && user == null)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User not found!"
				});
			}
			string userEmail = null;
			if (userRequest.currentOrganizationId !=null)
			{
				userEmail = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(user?.UserId, userRequest.currentOrganizationId);
			}

			string email = userEmail ?? userRequest.email;
			var isExist = await userRequestActions.IsExist(email, userRequest.organizationId, (int)userRequest.roleId);
			if (isExist)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = "",
					message = "User Request Already Exists!"
				});
			}
			else
			{
				// exsting user k liye null a rhi hai email

				if (user != null || (!string.IsNullOrEmpty(userRequest.email) && userRequest.organizationId != 0
					&& !string.IsNullOrEmpty(userRequest.firstName) && !string.IsNullOrEmpty(userRequest.lastName)))
				{
					UserRequest userRequestObjt = new UserRequest
					{
						FirstName = user?.Firstname ?? userRequest.firstName,
						LastName = user?.Lastname ?? userRequest.lastName,
						Email = email,
						Dob = user?.Dob ?? userRequest.dob,
						ContactNumber = user?.ContactNumber ?? userRequest.contact_number,
						OrganizationId = userRequest.organizationId,
						UserId = user?.UserId ?? null,
						RoleId = userRequest.roleId,
						CreatedDate = DateTime.UtcNow.ToString(),
					};
					await userRequestActions.AddAsync(userRequestObjt);
					var emailType = EmailType.User_Membership_Request;
					var organization = await organizationActions.Get(userRequestObjt.OrganizationId);
					var role = await roleActions.Get((int)userRequestObjt.RoleId);
					string orgName = organization?.Name;
					string roleName = role?.Name;
					// Key Value Pair to replace in the body
					List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[firstName]", userRequestObjt.FirstName),
							new KeyValuePair<string, string>("[lastName]", userRequestObjt.LastName),
							new KeyValuePair<string, string>("[orgName]", orgName),
							new KeyValuePair<string, string>("[roleName]", roleName)
						};
					try
					{
						await mailRepo.SendEmail(userRequestObjt.Email, emailType, replacementDict);
						return StatusCode(200, new
						{
							statusCode = 200,
							message = "User Request Successfully Added !"
						});
					}
					catch (Exception)
					{
						throw;
					}

				}
				else
				{
					return StatusCode(400, new
					{
						statusCode = 400,
						message = "Error Occured While Adding Request !"
					});
				}
			}

		}
		[HttpGet]
		[Route("GetUserRequestsForApproval")]
		public async Task<dynamic> GetUserRequestsAsync(int organizationId, int offset, int limit)
		{
			limit = limit == 0 ? 10 : limit;
			var userReqs = await userRequestActions.GetUserRequests(organizationId, offset, limit);

			if (userReqs != null && userReqs.Count > 0)
			{
				List<UserRequestGetDTO> userRequests = new List<UserRequestGetDTO>();
				userReqs.ForEach(x =>
				{
					userRequests.Add(CreateUserRequest(x));
				});
				return StatusCode(200, new
				{
					statusCode = 200,
					result = userRequests,
					message = $"{userRequests.Count} User Request(s) Found !"
				});
			}
			else
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = "",
					message = "No Request(s) Found against this Organization"
				});
			}

		}

		[HttpPost]
		[Route("SetUserRequestApprovalStatus")]
		public async Task<dynamic> SetUserRequestApprovalStatusAsync(UserRequestApprovalDTO userRequest)
		{
			var userRequestsDbData = await userRequestActions.Get(userRequest.userRequestId);
			string msg = string.Empty;
			string password = string.Empty;
			int userOgranizationId = 0;
			int? userId = 0;
			if (userRequestsDbData == null)
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = "",
					message = "User Request Does Not Exists !"
				});
			}
			if (userRequest.isApproved == true)
			{
				userId = userRequestsDbData.UserId;
				if (userId == null || userId == 0)
				{
					password = RandomPasswordGenerator.GeneratePassword();
					User userObj = new User
					{
						Firstname = userRequestsDbData.FirstName,
						Lastname = userRequestsDbData.LastName,
						//Email = userRequestsDbData.Email,
						CreatedDate = DateTime.UtcNow.ToString(),
						IsActive = 1,
						Password = Encryption.Encode(password),
					};
					await userActions.AddAsync(userObj);
					userId = userObj.UserId;
				}
				// if user is from the same organization 
				var userOrganization = await userOrganizationActions.GetUserOrganization(userRequestsDbData.OrganizationId, (int)userId);
				if (userOrganization != null)
				{
					userOgranizationId = userOrganization.UserOrganizationId;
				}
				else
				{
					// if user if not from the same organization
					UserOrganization userOrganizationObj = new UserOrganization
					{
						UserId = (int)userId,
						OrganizationId = userRequestsDbData.OrganizationId
					};
					await userOrganizationActions.AddAsync(userOrganizationObj);
					userOgranizationId = userOrganizationObj.UserOrganizationId;
				}

				// add email against organization
				UserOrganizationEmail emailObj = new UserOrganizationEmail()
				{
					UserId = (int)userId,
					Email = userRequestsDbData.Email,
					OrganizationId = userRequestsDbData.OrganizationId,
					IsVerified = 1,
					IsNotificationOn = 1,
					IsPrimary = 1,
				};
				await userOrganizationEmailActions.AddAsync(emailObj);

				// add user to user_organization_role (assigne role to the user)
				UserOrganizationRole userOrganizationRoleObj = new UserOrganizationRole()
				{
					UserOrganizationId = userOgranizationId,
					RoleId = (int)(userRequest.roleId ?? userRequestsDbData.RoleId),
					CreatedBy = userId,
					CreatedDate = DateTime.UtcNow.ToString(),
				};
				await userOrganizationRoleActions.AddAsync(userOrganizationRoleObj);

				userRequestsDbData.IsApproved = userRequest.isApproved.ConvertToUlong();
				userRequestsDbData.ApprovedBy = userRequest.userId;
				userRequestsDbData.UserId = userId;
				userRequestsDbData.IsRejected = null;
				userRequestsDbData.RejectedBy = null;
				msg = RequestStatus.Approved.ToString();
			}
			else if (userRequest.isRejected == true)
			{
				userRequestsDbData.IsRejected = userRequest.isRejected.ConvertToUlong();
				userRequestsDbData.RejectedBy = userRequest.userId;
				userRequestsDbData.IsApproved = null;
				userRequestsDbData.ApprovedBy = null;
				msg = RequestStatus.Rejected.ToString();
			}
			await userRequestActions.UpdateAsync(userRequestsDbData);
			var organization = await organizationActions.Get(userRequestsDbData.OrganizationId);
			var user = await userActions.Get(userRequestsDbData.UserId);
			var role = await roleActions.Get((int)userRequestsDbData.RoleId);
			// add entry to user and organization table
			if ((userRequest.isApproved.HasValue && userRequest.isApproved.Value) || (userRequest.isRejected.HasValue && userRequest.isRejected.Value))
			{
				string link = _appSettings.Domain + $"/dashboard?orgId={organization.OrganizationId}";

				// Key Value Pair to replace in the body
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
				{
					new KeyValuePair<string, string>("[firstName]", user?.Firstname ?? userRequestsDbData.FirstName),
					new KeyValuePair<string, string>("[lastName]", user?.Lastname ?? userRequestsDbData.LastName),
					new KeyValuePair<string, string>("[orgName]", organization?.Name),
					new KeyValuePair<string, string>("[roleName]", role?.DisplayName),
					new KeyValuePair<string, string>("[password]", String.IsNullOrEmpty(password) ? String.Empty : $"Please use your email and password is {password} to login."),
					new KeyValuePair<string, string>("[reason]", userRequestsDbData.Reason),
					new KeyValuePair<string, string>("[orgPage]", link)
				};
				try
				{
					await mailRepo.SendEmail(userRequestsDbData.Email, msg == RequestStatus.Approved.ToString() ? EmailType.User_Membership_Approved : EmailType.User_Membership_Rejectd, replacementDict);
					return StatusCode(200, new
					{
						statusCode = 200,
						message = $"User Requeset {msg}!"
					});
				}
				catch (Exception)
				{
					throw;
				}
			}
			return StatusCode(200, new
			{
				statusCode = 200,
				result = userRequestsDbData,
				message = $"User Requeset {msg}!"
			});
		}
		[NonAction]
		private UserRequestGetDTO CreateUserRequest(UserRequest userRequest)
		{
			return new UserRequestGetDTO()
			{
				userRequestId = userRequest.UserRequestId,
				userId = userRequest.UserId,
				firstName = userRequest.FirstName,
				lastName = userRequest.LastName,
				contact_number = userRequest.ContactNumber,
				dob = userRequest.Dob,
				email = userRequest.Email,
				approvedBy = userRequest.ApprovedBy,
				isApproved = userRequest.IsApproved.ConvertToBool(),
				rejectedBy = userRequest.RejectedBy,
				isRejected = userRequest.IsRejected.ConvertToBool(),
				organizationId = userRequest.OrganizationId,
				roleId = userRequest.RoleId,
				role = new RoleDTO()
				{
					roleId = userRequest.Role.RoleId,
					name = userRequest.Role.Name,
					displayName = userRequest.Role.DisplayName,
					details = userRequest.Role.Details,
				},
			};
		}
	}
}
