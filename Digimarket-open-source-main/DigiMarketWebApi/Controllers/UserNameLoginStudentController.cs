using DbRepository.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DigiMarketWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Core.Helper;
using System.Net;
using Thirdparty.Helper;
using Microsoft.AspNetCore.Localization;
using System.Data;
using Thirdparty.Mail;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using DbRepository.Modules;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Controllers
{
	public class UserNameLoginStudentController : BaseController
	{
		private readonly OrganizationActions organizationActions;
		private readonly UserOrganizationRoleActions userOrganizationRoleActions;
		private readonly RoleActions roleActions;
		private readonly UserOrganizationActions userOrganizationActions;
		private readonly UsernameLoginStudentOrganizationActions usernameLoginStudentOrganizationActions;
		private readonly UserActions userActions;
		private readonly UsernameLoginStudentActions usernameLoginStudentActions;
		private readonly IMailRepo mailRepo;
		private readonly Appsettings _appSettings;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		public UserNameLoginStudentController(OrganizationActions organizationActions, UserOrganizationRoleActions userOrganizationRoleActions, RoleActions roleActions, UserOrganizationActions userOrganizationActions, UsernameLoginStudentOrganizationActions usernameLoginStudentOrganizationActions, UserActions userActions, UsernameLoginStudentActions usernameLoginStudentActions, IMailRepo _mailRepo, IOptions<Appsettings> appSettings, UserOrganizationEmailActions userOrganizationEmailActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.organizationActions = organizationActions;
			this.userOrganizationRoleActions = userOrganizationRoleActions;
			this.roleActions = roleActions;
			this.userOrganizationActions = userOrganizationActions;
			this.usernameLoginStudentOrganizationActions = usernameLoginStudentOrganizationActions;
			this.userActions = userActions;
			this.usernameLoginStudentActions = usernameLoginStudentActions;
			mailRepo = _mailRepo;
			_appSettings = appSettings.Value;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
		}
		[HttpPost]
		[Route("CreateUsernameLoginStudentRequest")]
		public async Task<dynamic> CreateUsernameLoginStudentRequestAsync(AddUsernameLLoginRequestDTO userNameLogin)
		{
			var isUserNameExist = await usernameLoginStudentActions.GetAll().AnyAsync(n => n.UserName.ToLower().Trim() == userNameLogin.userName.ToLower().Trim());
			if (isUserNameExist)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Username Already exist!");
			}
			var userNameLoginStudentObj = new UsernameLoginStudent()
			{
				FirstName = userNameLogin.firstName,
				LastName = userNameLogin.lastName,
				Dob = userNameLogin.dob,
				Image = userNameLogin.image,
				LinkParentId = userNameLogin.linkParentId,
				UserName = userNameLogin.userName,
				IsParent = userNameLogin.isParent.ConvertToUlong(),
				IsShareInfo = userNameLogin.isShareInfo.ConvertToUlong(),
				CreatedBy = userNameLogin.createdBy,
				CreatedDate = DateTime.UtcNow.ToString(),
				Status = Status.Pending.ToString(),
			};
			await usernameLoginStudentActions.AddAsync(userNameLoginStudentObj);

			//_context.Entry(userNameLoginStudentObj).Reference(x => x.LinkParent).Load();

			var linedParent = await userActions.Get(userNameLoginStudentObj.LinkParentId);
			List<UsernameLoginStudentOrganization> usernameLoginStudentOrganizationObj = new List<UsernameLoginStudentOrganization>();
			foreach (var organizationId in userNameLogin.organizationIds)
			{
				usernameLoginStudentOrganizationObj.Add(new UsernameLoginStudentOrganization()
				{
					UsernameLoginStudentId = userNameLoginStudentObj.UsernameLoginStudentId,
					OrganizationId = organizationId,
				});
			}
			await usernameLoginStudentOrganizationActions.AddRangeAsync(usernameLoginStudentOrganizationObj);


			if (userNameLogin.isParent == true)
			{
				// approve the student + send the email to parent with password
				await UpdateStatusOfStudentAsync(Status.Approved, userNameLoginStudentObj.UsernameLoginStudentId, userNameLogin.createdBy);
				return StatusCodes(HttpStatusCode.OK, string.Empty, "Username login student added and email is sent with credentials!");
			}
			else
			{
				// mail send to parent for approval
				await sendApprovalEmailAsync(userNameLoginStudentObj, userNameLogin.organizationIds.FirstOrDefault());
				return StatusCodes(HttpStatusCode.OK, string.Empty, "Username login student request added!");

			}

		}

		[HttpPost]
		[Route("UpdateUsernameLoginRequest")]
		public async Task<dynamic> UpdateUsernameLoginRequest(AddUsernameLLoginRequestDTO userNameLogin, int loggedInUserId)
		{
			var isUserRequestExsit = await usernameLoginStudentActions.Get(userNameLogin.usernameLoginStudentId);
			if (isUserRequestExsit == null)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Username Login Student Request not Found!");

			}
			if (userNameLogin.isApprved == true || userNameLogin.isRejected == true)
			{
				isUserRequestExsit.Dob = userNameLogin.dob;
				await usernameLoginStudentActions.UpdateAsync(isUserRequestExsit);
				var status = userNameLogin.isApprved == true ? Status.Approved : Status.Rejected;
				await UpdateStatusOfStudentAsync(status, userNameLogin.usernameLoginStudentId, loggedInUserId);
				string msg = string.Empty;
				msg = userNameLogin.isApprved == true ? "Username Login Student Request Approved and email is sent with credentials" : "Username Login Student Request Rejected";
				return StatusCodes(HttpStatusCode.OK, string.Empty, msg);

			}
			else
			{
				isUserRequestExsit.FirstName = userNameLogin.firstName;
				isUserRequestExsit.LastName = userNameLogin.lastName;
				isUserRequestExsit.Dob = userNameLogin.dob;
				isUserRequestExsit.Image = userNameLogin.image;
				isUserRequestExsit.IsShareInfo = userNameLogin.isShareInfo.ConvertToUlong();
				await usernameLoginStudentActions.UpdateAsync(isUserRequestExsit);

				if (isUserRequestExsit.UserId != null || isUserRequestExsit.UserId != 0)
				{
					var existingUser = await userActions.Get(isUserRequestExsit.UserId);
					existingUser.Firstname = userNameLogin.firstName;
					existingUser.Lastname = userNameLogin.lastName;
					existingUser.Dob = userNameLogin.dob;
					existingUser.Image = userNameLogin.image;
					await userActions.UpdateAsync(existingUser);

					var userOrganizations = await userOrganizationActions.GetAll().Where(x => x.UserId == existingUser.UserId).ToListAsync();
					if (userOrganizations.Count > 0)
					{
						var roles = await userOrganizationRoleActions.GetAll().Where(x => userOrganizations.Select(n => n.UserOrganizationId).Contains(x.UserOrganizationId)).ToListAsync();
						if (roles.Count > 0)
						{
							await userOrganizationRoleActions.RemoveRangeAsync(roles);
						}

						await userOrganizationActions.RemoveRangeAsync(userOrganizations);
					}
					// orags id
					var userorgs = await usernameLoginStudentOrganizationActions.GetAll().Where(x => x.UsernameLoginStudentId == userNameLogin.usernameLoginStudentId).ToListAsync();
					if (userorgs.Count > 0)
					{
						await usernameLoginStudentOrganizationActions.RemoveRangeAsync(userorgs);
					}
					List<UsernameLoginStudentOrganization> usernameLoginStudentOrganizationObj = new List<UsernameLoginStudentOrganization>();
					foreach (var organizationId in userNameLogin.organizationIds)
					{
						usernameLoginStudentOrganizationObj.Add(new UsernameLoginStudentOrganization()
						{
							UsernameLoginStudentId = userNameLogin.usernameLoginStudentId,
							OrganizationId = organizationId,
						});
					}
					await usernameLoginStudentOrganizationActions.AddRangeAsync(usernameLoginStudentOrganizationObj);


					foreach (var organizationId in userNameLogin.organizationIds)
					{
						var userOrg = new UserOrganization()
						{
							UserId = existingUser.UserId,
							OrganizationId = organizationId,
							CreatedDate = DateTime.UtcNow.ToString(),
							CretaedBy = loggedInUserId,
						};
						await userOrganizationActions.AddAsync(userOrg);
						var studentRole = await roleActions.GetAll().FirstOrDefaultAsync(x => x.OrganizationId == organizationId && x.Name == RoleType.UsernameLoginStudent.ToString());
						if (studentRole != null)
						{
							await AssignRoleToUserAsync(studentRole.RoleId, userOrg.UserOrganizationId, existingUser.UserId);
						}
					}

				}
				return StatusCodes(HttpStatusCode.OK, string.Empty, "Username Login Student request Updated!");
			}

		}
		[HttpGet]
		[Route("GetUsernameLoginRequests")]
		public async Task<dynamic> GetUsernameLoginRequestsAsync(int organizationId, int parentId = 0)
		{
			Expression<Func<UsernameLoginStudent, bool>> wherePredicate = x =>
							((x.UserId == null || organizationId == 0) ||
							x.UserId != null && x.UsernameLoginStudentOrganizations.
							Any(m => m.Organization.UserOrganizations.Any(n => n.UserId == x.UserId && m.OrganizationId == organizationId && n.IsActive != 0)))
							&&
							((parentId != 0 && x.LinkParentId == parentId && x.IsDeleted != 1)
							||
							(parentId == 0 && organizationId != 0 && x.UsernameLoginStudentOrganizations.Any(n => n.OrganizationId == organizationId)));
			var userLogins = await usernameLoginStudentActions.GetAll().Where(wherePredicate)
				.Include(x => x.LinkParent)
				.Include(x => x.User)
				.Include(x => x.UsernameLoginStudentOrganizations).ThenInclude(x => x.Organization).ThenInclude(x => x.UserOrganizations)
				.ToListAsync();

			List<GetUsernameLoginRequestDTO> usernameLoginRequests = new List<GetUsernameLoginRequestDTO>();

			userLogins.ForEach(x =>
			{
				var organizationsList = new List<ObjectInfo>();
				if (x.UsernameLoginStudentOrganizations != null && x.UsernameLoginStudentOrganizations.Count > 0)
				{
					foreach (var organization in x.UsernameLoginStudentOrganizations)
					{
						organizationsList.Add(new ObjectInfo()
						{
							id = organization.Organization.OrganizationId,
							name = organization.Organization.Name
						});
					}
				}
				usernameLoginRequests.Add(new GetUsernameLoginRequestDTO()
				{
					usernameLoginStudentId = x.UsernameLoginStudentId,
					userName = x.UserName,
					firstName = x.FirstName,
					lastName = x.LastName,
					userId = x.UserId,
					dob = x.Dob,
					image = x.Image,
					linkedParent = new ObjectInfo() { id = x.LinkParent.UserId, name = x.LinkParent.Firstname + " " + x.LinkParent.Lastname },
					createdBy = x.CreatedBy,
					createdDate = x.CreatedDate,
					status = x.Status,
					isShareInfo = x.IsShareInfo.ConvertToBool(),
					linkedOrganizations = organizationsList,
				});
			});
			return StatusCodes(HttpStatusCode.OK, usernameLoginRequests, $"{usernameLoginRequests.Count} Result Found!");

		}
		[HttpDelete]
		[Route("DeleteUsernameLoginStudentRequest")]
		public async Task<dynamic> DeleteUsernameLoginStudentRequest(int userNameLoginId)
		{

			var userNameRequest = await usernameLoginStudentActions.Get(userNameLoginId);
			if (userNameRequest == null)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Username Login Request Not Found!");
			}
			if (userNameRequest.StatusId != (int)Status.Rejected)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Username Login Request Not Rejected!");
			}

			//var userNameOrgs = await usernameLoginStudentOrganizationActions.GetAll().Where(x => x.UsernameLoginStudentId == userNameLoginId).ToListAsync();
			//await usernameLoginStudentOrganizationActions.RemoveRangeAsync(userNameOrgs);

			//await usernameLoginStudentActions.RemoveAsync(userNameRequest);
			userNameRequest.IsDeleted = 1;
			await usernameLoginStudentActions.UpdateAsync(userNameRequest);


			return StatusCodes(HttpStatusCode.OK, string.Empty, "Username login student request Removed!");
		}


		[NonAction]
		public async Task UpdateStatusOfStudentAsync(Status status, int usernameLoginStudentId, int userId)
		{
			var usernameStudentObj = await usernameLoginStudentActions.GetAll().Where(x => x.UsernameLoginStudentId == usernameLoginStudentId).
				Include(x => x.UsernameLoginStudentOrganizations)
				.Include(x => x.LinkParent).FirstOrDefaultAsync();
			if (status == Status.Approved)
			{
				// create user
				var newUserId = await CreateUserAsync(usernameStudentObj, userId);
				usernameStudentObj.StatusId = (int)Status.Approved;
				usernameStudentObj.Status = Status.Approved.ToString();
				usernameStudentObj.UserId = newUserId;
				await usernameLoginStudentActions.UpdateAsync(usernameStudentObj);

			}
			else
			{
				usernameStudentObj.StatusId = (int)Status.Rejected;
				usernameStudentObj.Status = Status.Rejected.ToString();
				await usernameLoginStudentActions.UpdateAsync(usernameStudentObj);
			}
		}

		[NonAction]
		public async Task<int> CreateUserAsync(UsernameLoginStudent usernameLoginStudent, int userId)
		{
			string password = RandomPasswordGenerator.GeneratePassword();
			User userObj = new User()
			{
				Firstname = usernameLoginStudent.FirstName,
				Lastname = usernameLoginStudent.LastName,
				//Email = usernameLoginStudent.UserName,
				Password = Encryption.Encode(password),
				Dob = usernameLoginStudent.Dob,
				CreatedDate = DateTime.UtcNow.ToString(),
				//ParentId = usernameLoginStudent.LinkParentId,
				IsActive = 1,
				Image = usernameLoginStudent.Image,
			};
			await userActions.AddAsync(userObj);

			foreach (var orgnizationId in usernameLoginStudent.UsernameLoginStudentOrganizations.Select(x => x.OrganizationId))
			{
				UserOrganization userOrganization = new UserOrganization()
				{
					UserId = userObj.UserId,
					OrganizationId = orgnizationId,
					CreatedDate = DateTime.UtcNow.ToString(),
					CretaedBy = userId,
				};
				await userOrganizationActions.AddAsync(userOrganization);
				var userOrgnizationId = userOrganization.UserOrganizationId;
				var studentRole = await roleActions.GetAll().FirstOrDefaultAsync(x => x.OrganizationId == orgnizationId && x.Name == RoleType.UsernameLoginStudent.ToString());
				if (studentRole != null)
				{
					await AssignRoleToUserAsync(studentRole.RoleId, userOrgnizationId, userId);
				}

				// add email against organization
				UserOrganizationEmail emailObj = new UserOrganizationEmail()
				{
					UserId = userObj.UserId,
					Email = usernameLoginStudent.UserName,
					OrganizationId = orgnizationId,
					IsVerified = 1,
					IsNotificationOn = 1,
					IsPrimary = 1,
				};
				await userOrganizationEmailActions.AddAsync(emailObj);

			}
			// send email 
			string link = _appSettings.Domain + $"/dashboard/add-students-parent";
			sendApprovedEmail(usernameLoginStudent, password, usernameLoginStudent.UsernameLoginStudentOrganizations.FirstOrDefault().OrganizationId, link);
			return userObj.UserId;
		}
		[NonAction]
		public async Task AssignRoleToUserAsync(int roleId, int userOrganizationId, int userId)
		{
			UserOrganizationRole userOrganizationRole = new UserOrganizationRole()
			{
				RoleId = roleId,
				CreatedBy = userId,
				CreatedDate = DateTime.UtcNow.ToString(),
				UserOrganizationId = userOrganizationId
			};
			await userOrganizationRoleActions.AddAsync(userOrganizationRole);
		}
		[NonAction]
		public async Task sendApprovalEmailAsync(UsernameLoginStudent usernameLoginStudent, int organizationId)
		{
			string link = _appSettings.Domain + $"/dashboard/add-students-parent";

			var organization = await organizationActions.Get(organizationId);
			List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[childFirstName]", usernameLoginStudent.FirstName),
							new KeyValuePair<string, string>("[childLastName]", usernameLoginStudent.LastName),
							new KeyValuePair<string, string>("[firstName]", usernameLoginStudent.LinkParent.Firstname),
							new KeyValuePair<string, string>("[lastName]", usernameLoginStudent.LinkParent.Lastname),
							new KeyValuePair<string, string>("[orgName]", organization?.Name),
							new KeyValuePair<string, string>("[link]", link)
						};
			try
			{
				var emails = await userOrganizationEmailActions.GetEmailsByOrganizationForNotifications(new List<int> { usernameLoginStudent.LinkParent.UserId }, organizationId);
				foreach (var email in emails.Select(x => x.email).ToList())
				{
					await mailRepo.SendEmail(email, EmailType.Admin_Add_Student_Approval_Request, replacementDict);
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

	}
}
