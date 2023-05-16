using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Net;
using Thirdparty.Helper;
using Thirdparty.Mail;
using DbRepository.Modules;
using Core.Helper;
using DataTransferObject;
using System.Data;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BaseController : ControllerBase
	{
		private readonly IMailRepo mailRepo;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		public BaseController(IMailRepo _mailRepo, UserOrganizationEmailActions userOrganizationEmailActions)
		{
			mailRepo = _mailRepo;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
		}
		[NonAction]
		public UserContentGetModel GetUserContentWithMeta(UserContent content)
		{
			var result = new UserContentGetModel()
			{

				contentId = content.ContentId,
				userId = content.UserId,
				name = content.Name,
				logo = content.Organization?.Logo,
				properties = content.UserContentMeta.Select(x => new UserContentMetaModel()
				{
					key = x.Key,
					value = x.Value,
					metaType = (Core.Helper.MetaType)(int)x.MetaType,
				}).ToList(),
			};
			return result;
		}
		[NonAction]
		public dynamic StatusCodes(HttpStatusCode code, dynamic result, string msg)
		{
			return StatusCode(((int)code), new
			{
				statusCode = code,
				result = result ?? string.Empty,
				message = msg
			});
		}
		[NonAction]
		public void sendApprovedEmail(UsernameLoginStudent usernameLoginStudent, string password, int organizationId, string kidsPage)
		{
			List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[childFirstName]", usernameLoginStudent.FirstName),
							new KeyValuePair<string, string>("[childLastName]", usernameLoginStudent.LastName),
							new KeyValuePair<string, string>("[firstName]", usernameLoginStudent.LinkParent.Firstname),
							new KeyValuePair<string, string>("[lastName]", usernameLoginStudent.LinkParent.Lastname),
							new KeyValuePair<string, string>("[userName]", usernameLoginStudent?.UserName),
							new KeyValuePair<string, string>("[password]", password),
							new KeyValuePair<string, string>("[kidsPage]", kidsPage)
						};
			try
			{
				var emails = userOrganizationEmailActions.GetEmailsByOrganizationForNotifications(new List<int> { usernameLoginStudent.LinkParent.UserId }, organizationId).Result;
				foreach (var email in emails.Select(x => x.email).ToList())
				{
					mailRepo.SendEmail(email, EmailType.Parent_Approve_Student_Request, replacementDict);
				}
			}
			catch (Exception)
			{
				throw;
			}
		}
		[NonAction]
		public void ForgerPassword(User user, string email, string link)
		{
			List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[firstName]", user.Firstname),
							new KeyValuePair<string, string>("[lastName]", user.Lastname),
							new KeyValuePair<string, string>("[link]", link)
						};
			try
			{
				mailRepo.SendEmail(email, EmailType.Forget_Password, replacementDict);

			}
			catch (Exception)
			{
				throw;
			}
		}
		[NonAction]
		public async Task<dynamic> SendInviteToUser(UserInvite userInviteObj, string link, User user, string organizationName, string roleName)
		{
			List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[firstName]",user?.Firstname ?? userInviteObj.FirstName),
							new KeyValuePair<string, string>("[lastName]", user?.Lastname ?? userInviteObj.LastName),
							new KeyValuePair<string, string>("[orgName]", organizationName),
							new KeyValuePair<string, string>("[roleName]", roleName),
							new KeyValuePair<string, string>("[acceptLink]", link),
						};
			try
			{
				var email = userInviteObj.EmailAddress;
				await mailRepo.SendEmail(email, EmailType.Invite_User_to_Organization, replacementDict);

				return StatusCodes(HttpStatusCode.OK, string.Empty, "Invite Sent!");
			}
			catch (Exception)
			{
				throw;
			}
		}
		[NonAction]
		public bool HasAccessToLesson(UserContentSharingPermission lessonSharingDetails, int contentId, string Token, int? userId, int? organizationId, List<UserRolesWithOrganizationDTO> userRoles)
		{
			bool hasAccess = false;

			if (lessonSharingDetails != null)
			{
				var allRoles = userRoles.Select(x => x.roles).ToList();
				if (lessonSharingDetails.PermissionsUserContent.CreatedBy == userId)
				{
					return true;
				}
				if (lessonSharingDetails.IsPrivate.ConvertToBool() == true)
				{
					return false;
				}

				if (lessonSharingDetails.SharedToAll.ConvertToBool() == true)
				{
					return true;
				}
				if (!hasAccess && userId.HasValue && userId != 0 && lessonSharingDetails.ShareAlsoWithStudentsOfAllOgranizations.ConvertToBool() == true)
				{
					hasAccess = allRoles.Any(x => x.Any(n => n == RoleType.UsernameLoginStudent.ToString() || n == RoleType.Student.ToString()));
				}
				if (!hasAccess && userId.HasValue && userId != 0 && organizationId.HasValue && organizationId != 0 && lessonSharingDetails.ShareAlsoWithStudentsOfMyOgranizations.ConvertToBool() == true)
				{
					hasAccess = userRoles.Any(x => x.organizationId == organizationId && x.roles.Any(n => n == RoleType.UsernameLoginStudent.ToString() || n == RoleType.Student.ToString()));

				}
				if (!hasAccess && lessonSharingDetails.ShareToAllOgranizations.ConvertToBool() == true)
				{
					hasAccess = userId.HasValue && userId != 0 && allRoles.Any(x => x.Any(n => n != RoleType.UsernameLoginStudent.ToString() && n != RoleType.Student.ToString()));

				}
				if (!hasAccess && organizationId.HasValue && organizationId != 0 && lessonSharingDetails.ShareToMyOgranizations.ConvertToBool() == true)
				{
					hasAccess = userRoles.Any(x => x.organizationId == organizationId && x.roles.Any(n => n != RoleType.UsernameLoginStudent.ToString() && n != RoleType.Student.ToString())) && lessonSharingDetails.PermissionsUserContent.OrganizationId == organizationId;
				}
				if (!hasAccess && lessonSharingDetails.SharedWithSpecificPeople.ConvertToBool() == true)
				{
					hasAccess = lessonSharingDetails.PermissionsUserContent.SpecificUserPrmissions.Any(x => x.ContentId == contentId && (userId.HasValue && userId != 0 ? x.RequestBy == userId && !string.IsNullOrEmpty(x.Token) : x.Token == Token));
				}
			}
			return hasAccess;

		}

	}
}
