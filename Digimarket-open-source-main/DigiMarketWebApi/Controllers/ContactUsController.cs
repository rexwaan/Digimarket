using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Microsoft.EntityFrameworkCore;
using DbRepository.Modules;
using DataTransferObject;

namespace DigiMarketWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ContactUsController : BaseController
	{
		private readonly IMailRepo mailRepo;
		private readonly ContactUsActions contactUsActions;
		private readonly OrganizationActions organizationActions;
		private readonly PermissionActions permissionActions;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly UserOrganizationActions userOrganizationActions;
		public ContactUsController(UserOrganizationEmailActions userOrganizationEmailActions, UserOrganizationActions userOrganizationActions, ContactUsActions contactUsActions, IMailRepo _mailRepo, OrganizationActions organizationActions, PermissionActions permissionActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			this.userOrganizationActions = userOrganizationActions;
			this.contactUsActions = contactUsActions;
			mailRepo = _mailRepo;
			this.organizationActions = organizationActions;
			this.permissionActions = permissionActions;
		}
		[HttpPost]
		[Route("AddContactUsRequest")]
		public async Task<dynamic> AddContactUsRequestAsync(CreateContactUsModel createContactUsModel)
		{
			var contactUs = await contactUsActions.GetContactUs(createContactUsModel.organizationID, createContactUsModel.Id);
			if (contactUs == null)
			{
				ContactU contactU = new ContactU()
				{
					FirstName = createContactUsModel.firstName,
					LastName = createContactUsModel.lastName,
					EmailAddress = createContactUsModel.emailAddress,
					ContactUsOrganizationId = createContactUsModel.organizationID,
					Message = createContactUsModel.message,
					Phone = createContactUsModel.phone,
					Topic = createContactUsModel.topic,
					CreatedBy = createContactUsModel.userId == null || createContactUsModel.userId == 0 ? null : createContactUsModel.userId,
					CreatedDate = DateTime.UtcNow.ToString(),
				};
				await contactUsActions.AddAsync(contactU);

				var organization = await organizationActions.Get(contactU.ContactUsOrganizationId ?? 0);
				// email
				// Key Value Pair to replace in the body
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
				{
					new KeyValuePair<string, string>("[firstName]", contactU.FirstName),
					new KeyValuePair<string, string>("[lastName]", contactU.LastName),
					new KeyValuePair<string, string>("[orgName]", organization?.Name),
					new KeyValuePair<string, string>("[topic]", contactU.Topic),
					new KeyValuePair<string, string>("[message]", contactU.Message),
					new KeyValuePair<string, string>("[email]", contactU.EmailAddress),
					new KeyValuePair<string, string>("[contact]", contactU.Phone)
				};
				try
				{
					await mailRepo.SendEmail(contactU.EmailAddress, EmailType.Contact_Us, replacementDict);
					foreach (var email in (await GetEmailsWhoHasContactUsPermissionAsync(createContactUsModel.organizationID)).Select(x => x.email).ToList())
					{
						await mailRepo.SendEmail(email ?? contactU.ContactUsOrganization?.EmailAddress, EmailType.Contact_Us_Notification, replacementDict);
					}
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
			else
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "Already Requested!"
				});
			}
		}
		[HttpGet]
		[Route("GetContactUsList")]
		public async Task<dynamic> GetContactUsListAsync(int organizationId, bool getArchivedAlso = false)
		{
			var contactUs = await contactUsActions.GetAllByOrganizationAsync(organizationId, getArchivedAlso);
			if (contactUs != null)
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = contactUs,
					message = $"{contactUs.Count} ContactUs Found"
				});
			}
			else
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "contactUs Not Found !"
				});
			}
		}
		[HttpDelete]
		[Route("DeleteContactUs")]
		public async Task<dynamic> DeleteContactUs(int contactUsId)
		{
			var contactUs = await contactUsActions.Get(contactUsId);
			if (contactUs != null)
			{
				await contactUsActions.RemoveAsync(contactUs);
				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = $"Deleted successfully"
				});
			}
			else
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "Data Not Found !"
				});
			}
		}
		[HttpPatch]
		[Route("ArchiveContactUs")]
		public async Task<dynamic> ArchiveContactUs(int contactUsId, bool archive)
		{
			var contactUs = await contactUsActions.Get(contactUsId);
			if (contactUs != null)
			{
				contactUs.IsArchived = archive ? 1 : ulong.MinValue;
                await contactUsActions.UpdateAsync(contactUs);
                return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = $"{(archive ? "Archived" : "Unarchived")} successfully"
				});

            }
			else
			{
				return StatusCode(200, new
				{
					statusCode = 200,
					result = "",
					message = "Data Not Found !"
				});
			}
		}

		[NonAction]
		public async Task<List<EmailWithUserDTO>> GetEmailsWhoHasContactUsPermissionAsync(int organizationId)
		{
			var res = await userOrganizationActions.GetEmailsWhoHasContactUsPermissionAsync(organizationId);
			if (!res.success)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, res.msg);
			}
			return res.emails ?? new List<EmailWithUserDTO>();
		}
	}
}
