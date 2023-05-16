using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Thirdparty.Helper;
using Thirdparty.Mail;
using System.Xml.Linq;
using Core.Helper;
using Microsoft.Extensions.Options;
using DbRepository.Modules;
using System.Security.Cryptography;
using System.Net;
using DataTransferObject;

namespace DigiMarketWebApi.Controllers
{
	public class UserContentController : BaseController
	{
		private readonly UserContentAttachmentActions userContentAttachmentActions;
		private readonly UserContentMetaActions userContentMetaActions;
		private readonly SpecificUserPrmissionActions specificUserPrmissionActions;
		private readonly UserContentSharingPermissionsActions userContentSharingPermissionsActions;
		private readonly UserContentActions userContentActions;
		private readonly UserContentQuestionAction userContentQuestionActions;
		private readonly UserContentScratchProjectActions userContentScratchProjectActions;
		private readonly UserActions userActions;
		private readonly IMailRepo mailRepo;
		private readonly Appsettings _appSettings;
		private readonly UserContentAccessRequestActions userContentAccessRequestActions;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly OrganizationActions organizationActions;


		public UserContentController(UserContentScratchProjectActions userContentScratchProjectActions, UserContentQuestionAction userContentQuestionActions, UserContentAttachmentActions userContentAttachmentActions, UserContentMetaActions userContentMetaActions, SpecificUserPrmissionActions specificUserPrmissionActions, UserContentSharingPermissionsActions userContentSharingPermissionsActions, UserContentActions userContentActions, UserActions userActions, IMailRepo _mailRepo, IOptions<Appsettings> appSettings, UserContentAccessRequestActions userContentAccessRequestActions, UserOrganizationEmailActions userOrganizationEmailActions, OrganizationActions organizationActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.userContentScratchProjectActions = userContentScratchProjectActions;
			this.userContentQuestionActions = userContentQuestionActions;
			this.userContentAttachmentActions = userContentAttachmentActions;
			this.userContentMetaActions = userContentMetaActions;
			this.specificUserPrmissionActions = specificUserPrmissionActions;
			this.userContentSharingPermissionsActions = userContentSharingPermissionsActions;
			this.userContentActions = userContentActions;
			this.userActions = userActions;
			mailRepo = _mailRepo;
			_appSettings = appSettings.Value;
			this.userContentAccessRequestActions = userContentAccessRequestActions;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			this.organizationActions = organizationActions;
		}
		[HttpPost]
		[Route("CreateUpdateUserContent")]
		public async Task<dynamic> CreateUpdateUserContentAsync(CreateContentModel createContentModel)
		{
			var user = await userActions.Get(createContentModel.userId);
			var userId = 0;
			if (user != null)
			{
				userId = user.UserId;
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
			// check if content exist
			var existingUserContent = await userContentActions.GetAll().Where(x => x.ContentId == createContentModel.contentId)
				.Include(x => x.UserContentMeta)
				.Include(x => x.UserContentAttachments)
				.Include(x => x.SpecificUserPrmissions)
				.Include(x => x.UserContentQuestions)
				.Include(x => x.UserContentScratchProjects)
				.Include(x => x.UserContentSharingPermissions)
				.Include(x => x.CreatedByNavigation)
				.Include(x => x.DuplicatedFromNavigation).ThenInclude(x => x.User)
				.FirstOrDefaultAsync();
			var parentContent = await userContentActions.Get(createContentModel.parentContentId);
			if (existingUserContent == null)
			{
				UserContent userContent = new UserContent()
				{
					UserId = userId,
					Name = createContentModel.name,
					ContentId = createContentModel.contentId,
					IsDuplicate = (ulong)createContentModel.isDuplicate.ConvertToUlong(),
					OrganizationId = createContentModel.organizationId,
					ShortDescription = createContentModel.shortDescription,
					LongDescription = createContentModel.fullDescription,
					CreatedBy = userId,
					CreatedDate = DateTime.UtcNow.ToString(),

				};
				if (createContentModel.isDuplicate.HasValue && createContentModel.isDuplicate.Value)
				{
					userContent.DuplicatedFrom = parentContent.ContentId;
				}
				await userContentActions.AddAsync(userContent);

				// create manage sharing

				await CreateUpdateUserContentSharingPermissionAsync(userContent.ContentId, createContentModel.manageSharing);

				// create sharedAddresses

				await CreateUpdateSpecificUserPrmissions(userContent.ContentId, createContentModel.sharingAddresses);

				// create meta

				await CreateUpdateUserContentMetaAsync(userContent.ContentId, createContentModel.properties);

				// create attachments

				await CreateUpdateAttachmentAsync(userContent.ContentId, userContent.CreatedBy, createContentModel.attachments);

				// create questions
				await CreateUpdateQuestionsAsync(userContent.ContentId, userContent.CreatedBy, createContentModel.questions);

				// create scratch project
				await CreateUpdateScratchProjectAsync(userContent.ContentId, userContent.CreatedBy, createContentModel.scratchProject);

				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = "User Content Added Successfully.",
				});
			}
			else
			{
				existingUserContent.Name = createContentModel.name;
				existingUserContent.ShortDescription = createContentModel.shortDescription;
				existingUserContent.LongDescription = createContentModel.fullDescription;
				await userContentActions.UpdateAsync(existingUserContent);
				var currentSharedWithSpecificPeople = existingUserContent.UserContentSharingPermissions.FirstOrDefault().SharedWithSpecificPeople.ConvertToBool();
				// update manage sharing

				await CreateUpdateUserContentSharingPermissionAsync(existingUserContent.ContentId, createContentModel.manageSharing);

				// update sharedAddresses
				if (currentSharedWithSpecificPeople == createContentModel.manageSharing.FirstOrDefault().sharedWithSpecificPeople)
				{
					await CreateUpdateSpecificUserPrmissions(existingUserContent.ContentId, createContentModel.sharingAddresses);
				}
				// update meta

				await CreateUpdateUserContentMetaAsync(existingUserContent.ContentId, createContentModel.properties);


				// create attachments

				await CreateUpdateAttachmentAsync(existingUserContent.ContentId, existingUserContent.CreatedBy, createContentModel.attachments);

				// create questions
				await CreateUpdateQuestionsAsync(existingUserContent.ContentId, existingUserContent.CreatedBy, createContentModel.questions);

				// create scratch project
				await CreateUpdateScratchProjectAsync(existingUserContent.ContentId, existingUserContent.CreatedBy, createContentModel.scratchProject);

				return StatusCode(200, new
				{
					statusCode = 200,
					result = string.Empty,
					message = "User Content Updated Successfully.",
				});
			}

		}

		[HttpGet]
		[Route("GetContent")]
		public async Task<dynamic> GetContent(string term, int offset, int limit, int? orgId, int? userId, string topic, string keyword, string language, int? age)
		{
			// topic key words age language
			limit = limit == 0 ? 10 : limit; // default limit is 10 
			List<UserContentGetModel> userContentList = new List<UserContentGetModel>();
			// predicate for filtration
			term = term?.Trim()?.ToLower();
			topic = topic?.Trim()?.ToLower();
			keyword = keyword?.Trim()?.ToLower();
			language = language?.Trim()?.ToLower();

			Expression<Func<UserContent, bool>> wherePredicate = x =>
							x.Organization.IsDeleted != 1 &&
							(term == null || x.Name.Trim().ToLower().Contains(term) /*|| x.ShortDescription.Trim().ToLower().Contains(term)*/)
							&&
							(topic == null || x.UserContentMeta.FirstOrDefault(n => n.Key == UserContentMetaEnum.Topic.GetDescription()).Value.Trim().ToLower().Contains(topic))
							&&
							(keyword == null || x.UserContentMeta.FirstOrDefault(n => n.Key == UserContentMetaEnum.Keywords.GetDescription()).Value.Trim().ToLower().Contains(keyword))
							&&
							(language == null || x.UserContentMeta.FirstOrDefault(n => n.Key == UserContentMetaEnum.Language.GetDescription()).Value.Trim().ToLower().Contains(language))
							;
			var contens = await userContentActions.GetAll()
				.Where(wherePredicate).Skip(offset).Take(limit)
				.Include(x => x.UserContentMeta)
				.Include(x => x.UserContentAttachments)
				.Include(x => x.SpecificUserPrmissions)
				.Include(x => x.UserContentQuestions)
				.Include(x => x.UserContentScratchProjects)
				.Include(x => x.UserContentSharingPermissions)
				.Include(x => x.Organization)
				.Include(x => x.CreatedByNavigation)
				.Include(x => x.DuplicatedFromNavigation).ThenInclude(x => x.User).ToListAsync();
			// age filter
			if (age != null)
			{
				contens = contens.Where(x => int.Parse(x.UserContentMeta.FirstOrDefault(n => n.Key == UserContentMetaEnum.MinAge.GetDescription()).Value) <= age && int.Parse(x.UserContentMeta.FirstOrDefault(n => n.Key == UserContentMetaEnum.MaxAge.GetDescription()).Value) >= age).ToList();
			}
			if (contens != null)
			{

				if (contens.Count > 0)
				{
					foreach (var content in contens)
					{
						// check if user has access for this lesson
						List<UserRolesWithOrganizationDTO> userRoles = await userActions.GetUserRolesInAllOrganizations(userId);
						bool hasAccess = HasAccessToLesson(content.UserContentSharingPermissions.FirstOrDefault(), content.ContentId, string.Empty, userId, orgId, userRoles);
						userContentList.Add(CreateUserContent(content, hasAccess));
					}
					return StatusCode(200, new
					{
						statusCode = 200,
						result = userContentList,
						message = $"{userContentList.Count} Content(s) Found !"
					});
				}
				else
				{
					return StatusCode(400, new
					{
						statusCode = 400,
						result = userContentList,
						message = "User Content Not Found"
					});
				}
			}
			else
			{
				return StatusCode(400, new
				{
					statusCode = 400,
					result = userContentList,
					message = "User Content Not Found"
				});
			}
		}
		[HttpGet]
		[Route("GetContentById")]
		public async Task<dynamic> GetContentByIdAsync(int contentId, string token, bool ignoreToken = false, int? userId = null, int? organizationId = null)
		{
			Expression<Func<UserContent, bool>> wherePredicate = x =>
							(x.Organization.IsDeleted != 1 && x.ContentId == contentId)
							&& (ignoreToken == true || x.SpecificUserPrmissions.Any(x => x.Token == token))

							 ;
			var content = await userContentActions.GetAll()
				//.Where(x => x.Organization.IsDeleted != 1 && x.ContentId == contentId && x.SpecificUserPrmissions.Any(x => x.Token == token))
				.Where(wherePredicate)
				.Include(x => x.UserContentMeta)
				.Include(x => x.UserContentAttachments)
				.Include(x => x.SpecificUserPrmissions)
				.Include(x => x.UserContentQuestions)
				.Include(x => x.UserContentScratchProjects)
				.Include(x => x.UserContentSharingPermissions)
				.Include(x => x.Organization)
				.Include(x => x.CreatedByNavigation)
				.Include(x => x.DuplicatedFromNavigation).ThenInclude(x => x.User).FirstOrDefaultAsync();

			if (content != null)
			{
				List<UserRolesWithOrganizationDTO> userRoles = await userActions.GetUserRolesInAllOrganizations(userId);
				bool hasAccess = HasAccessToLesson(content.UserContentSharingPermissions.FirstOrDefault(), content.ContentId, token, userId, organizationId, userRoles);

				return StatusCode(200, new
				{
					statusCode = 200,
					result = CreateUserContent(content, hasAccess),
					message = "Content Found!"
				});

			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Content Not Found"
				});
			}
		}
		[HttpGet]
		[Route("GetContentDetails")]
		public async Task<dynamic> GetContentDetails(int contentId)
		{
			var content = await userContentActions.GetAll().Where(x => x.ContentId == contentId).
				Include(x => x.UserContentQuestions).
				Include(x => x.UserContentMeta).
				Include(x => x.UserContentAttachments).
				Include(x => x.UserContentScratchProjects).FirstOrDefaultAsync();
			if (content == null)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Content Not Found"
				});
			}
			List<UserContentQuestionDTO> questions = new List<UserContentQuestionDTO>();
			foreach (var question in content.UserContentQuestions)
			{
				questions.Add(new UserContentQuestionDTO()
				{
					questionId = question.UserContentQuestionId,
					question = question.Question,
					answers = JsonConvert.DeserializeObject<List<string>>(question.Answers),
					isMultiSelect = question.IsMultiselect.ConvertToBool(),
					questionDescription = question.QuestionDescription,
				});
			}
			List<UserContentScratchProjectDTO> scratchProjects = new List<UserContentScratchProjectDTO>();
			foreach (var sp in content.UserContentScratchProjects)
			{
				scratchProjects.Add(new UserContentScratchProjectDTO()
				{
					scracthProjectId = sp.UserContentScratchProjectId,
					link = sp.Link,
					name = sp.Name,
				});
			}
			List<UserContentMetaModel> resources = new List<UserContentMetaModel>();
			foreach (var res in content.UserContentMeta.Where(x => x.MetaType == (int)MetaType.Resource).ToList())
			{
				resources.Add(new UserContentMetaModel()
				{
					key = res.Key,
					value = res.Value,
					metaId = res.UserContentMetaId
				});
			}
			List<UserContentAttachments> attachments = new List<UserContentAttachments>();
			foreach (var attach in content.UserContentAttachments)
			{
				attachments.Add(new UserContentAttachments()
				{
					attachmentId = attach.AttachmentsId,
					attachmentKey = attach.AttachmentKey,
				});
			}
			ContentDetailsDTO data = new ContentDetailsDTO()
			{
				questions = questions,
				scratchProjects = scratchProjects,
				resources = resources,
				attachments = attachments
			};
			return StatusCode(200, new
			{
				statusCode = 200,
				result = data,
				message = string.Empty
			});
		}
		[HttpPost]
		[Route("AddRequestToAccessLesson")]
		public async Task<dynamic> AddRequestToAccessLesson(UserContentRequestDTO req)
		{
			string requesterName = req.name;
			string requesterEmail = req.email;
			if (req.requestedBy.HasValue)
			{
				// get primary email of user in current organization and full name
				requesterEmail = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(req.requestedBy, req.organizationId);
				requesterName = await userActions.GetFullName((int)req.requestedBy);
			}
			if (req.requestedBy == null && await userOrganizationEmailActions.GetAll().AnyAsync(x => x.Email == requesterEmail))
			{
				return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "Email id already exist on Digi. Kindly login to ask the access for this lesson!");
			}
			var res = await userContentAccessRequestActions.AddRequest(req.requestedBy, req.contentId, requesterEmail, requesterName, req.organizationId);

			if (res.isSuccess)
			{
				var lesson = await userContentActions.Get(req.contentId);
				var email = await userOrganizationEmailActions.GetPrimaryEmailByOrganization(lesson.CreatedBy, lesson.OrganizationId);
				string link = _appSettings.Domain + $"/confirm?requestId={res.requestId}"; //res.requestId
				var creatore = await userActions.Get(lesson.CreatedBy);
				var organztion = await organizationActions.Get(req.organizationId);

				// send email to lesson creator
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[requesterName]", requesterName ),
							new KeyValuePair<string, string>("[orgDetails]",organztion !=null ? $"from {organztion.Name}":string.Empty ),
							new KeyValuePair<string, string>("[firstName]", creatore.Firstname),
							new KeyValuePair<string, string>("[lastName]", creatore.Lastname),
							new KeyValuePair<string, string>("[lessonName]", lesson.Name),
							new KeyValuePair<string, string>("[requesterEmail]", requesterEmail),
							new KeyValuePair<string, string>("[link]", link)
						};
				try
				{

					await mailRepo.SendEmail(email, EmailType.Ask_Lesson_Owner_for_Access, replacementDict);

				}
				catch (Exception)
				{
					throw;
				}

			}
			return StatusCodes(res.isSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, res.msg);

		}
		[HttpPost]
		[Route("ApproveRequestToAccessLesson")]
		public async Task<dynamic> ApproveRequestToAccessLesson(int requestId)
		{

			var res = await userContentAccessRequestActions.ApproveRequest(requestId);
			if (res.isSuccess)
			{
				EmailDetails emailDetails = new EmailDetails()
				{
					email = res.requestData.Email,
					name = res.requestData.Name,
					token = res.token,
				};
				var SharingPermission = await userContentSharingPermissionsActions.GetAll().FirstOrDefaultAsync(x => x.PermissionsUserContentId == res.requestData.ContentId);
				if (SharingPermission.SharedWithSpecificPeople.ConvertToBool() != true)
				{
					await userContentSharingPermissionsActions.EnableShareWithSpecificPeoplePermission(res.requestData.ContentId);
					await EnableDisableSharing(res.requestData.ContentId, true);
				}
				await NotifySpecificUserForLessonAccessAsync(new List<EmailDetails>() { emailDetails }, res.requestData.ContentId, AddRemoveStatus.Add);

			}
			return StatusCodes(res.isSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, res.msg);

		}
		[NonAction]
		private UserContentGetModel CreateUserContent(UserContent content, bool hasAccess)
		{
			var result = new UserContentGetModel()
			{

				contentId = content.ContentId,
				userId = content.UserId,
				name = content.Name,
				logo = content.Organization?.Logo,
				shortDescription = content.ShortDescription,
				longDescription = content.LongDescription,
				organizationId = content.OrganizationId,
				createdByDetails = new UserDetails()
				{
					firstName = content.CreatedByNavigation.Firstname,
					lastName = content.CreatedByNavigation.Lastname,
					userId = content.CreatedByNavigation.UserId
				},
				isDuplicated = content.IsDuplicate == 1,
				properties = content.UserContentMeta.Select(x => new UserContentMetaModel()
				{
					key = x.Key,
					value = x.Value,
					metaType = (Core.Helper.MetaType)(int)x.MetaType,
				}).ToList(),
				attachments = content.UserContentAttachments.Select(x => new UserContentAttachments()
				{
					attachmentKey = x.AttachmentKey,
				}).ToList(),
				manageSharing = content.UserContentSharingPermissions.Select(x => new UserContentSharingPermissions()
				{
					isPrivate = x.IsPrivate.ConvertToBool(),
					shareAlsoWithStudentsOfAllOgranizations = x.ShareAlsoWithStudentsOfAllOgranizations.ConvertToBool(),
					shareAlsoWithStudentsOfMyOgranizations = x.ShareAlsoWithStudentsOfMyOgranizations.ConvertToBool(),
					shareToAllOgranizations = x.ShareToAllOgranizations.ConvertToBool(),
					shareToMyOgranizations = x.ShareToMyOgranizations.ConvertToBool(),
					sharedWithSpecificPeople = x.SharedWithSpecificPeople.ConvertToBool(),
					shareToAll = x.SharedToAll.ConvertToBool(),
				}).ToList(),
				sharingAddresses = content.SpecificUserPrmissions.Select(x => new UserContentSpecificUsersPermission()
				{
					approvedBy = x.ApprovedBy,
					isRequested = x.IsRequested.ConvertToBool(),
					requestBy = x.RequestBy,
					email = x.Email,
					name = x.Name,
					hasAccess = !string.IsNullOrEmpty(x.Token),
					userContentSpecificUsersPermissionId = x.SpecificUserPrmissionId
				}).ToList(),
				questions = content.UserContentQuestions.Select(x => new UserContentQuestionDTO()
				{
					question = x.Question,
					questionDescription = x.QuestionDescription,
					isMultiSelect = x.IsMultiselect.ConvertToBool(),
					answers = JsonConvert.DeserializeObject<List<string>>(x.Answers),
				}).ToList(),
				scratchProject = content.UserContentScratchProjects.Select(x => new UserContentScratchProjectDTO()
				{
					name = x.Name,
					link = x.Link,
				}).ToList(),
				hasAccess = hasAccess,
			};
			if (result.isDuplicated)
			{
				result.duplicatedFromLessonName = content.DuplicatedFromNavigation?.Name;
				result.duplicatedFrom = new UserDetails()
				{
					firstName = content?.DuplicatedFromNavigation?.User?.Firstname,
					lastName = content?.DuplicatedFromNavigation?.User?.Lastname,
					userId = content?.DuplicatedFromNavigation?.User.UserId
				};
			}
			return result;
		}
		[NonAction]
		private async Task CreateUpdateUserContentSharingPermissionAsync(int userContentId, List<UserContentSharingPermissions> userContentSharingPermissions)
		{
			var sharingPermissions = await userContentSharingPermissionsActions.GetAll().Where(x => x.PermissionsUserContentId == userContentId).ToListAsync();
			var currentSharedWithSpecificPeople = sharingPermissions.FirstOrDefault()?.SharedWithSpecificPeople.ConvertToBool();
			if (sharingPermissions.Count > 0)
			{
				await userContentSharingPermissionsActions.RemoveRangeAsync(sharingPermissions);
			}
			List<UserContentSharingPermission> userContentSharings = new List<UserContentSharingPermission>();
			foreach (var userContentSharingPermission in userContentSharingPermissions)
			{
				userContentSharings.Add(new UserContentSharingPermission()
				{
					PermissionsUserContentId = userContentId,
					IsPrivate = userContentSharingPermission.isPrivate.ConvertToUlong(),
					ShareAlsoWithStudentsOfAllOgranizations = userContentSharingPermission.shareAlsoWithStudentsOfAllOgranizations.ConvertToUlong(),
					ShareAlsoWithStudentsOfMyOgranizations = userContentSharingPermission.shareAlsoWithStudentsOfMyOgranizations.ConvertToUlong(),
					ShareToAllOgranizations = userContentSharingPermission.shareToAllOgranizations.ConvertToUlong(),
					ShareToMyOgranizations = userContentSharingPermission.shareToMyOgranizations.ConvertToUlong(),
					SharedWithSpecificPeople = userContentSharingPermission.sharedWithSpecificPeople.ConvertToUlong(),
					SharedToAll = userContentSharingPermission.shareToAll.ConvertToUlong(),
				});
				if (currentSharedWithSpecificPeople != userContentSharingPermission.sharedWithSpecificPeople)
				{
					await EnableDisableSharing(userContentId, userContentSharingPermission.sharedWithSpecificPeople == true);
				}
			}
			await userContentSharingPermissionsActions.AddRangeAsync(userContentSharings);
			return;

		}
		[NonAction]
		private async Task CreateUpdateSpecificUserPrmissions(int userContentId, List<UserContentSpecificUsersPermission> specificUserPrmissions)
		{
			var existingSpecificUserPrmission = await specificUserPrmissionActions.GetAll().Where(x => x.ContentId == userContentId).ToListAsync();
			List<EmailDetails> addedAccessEmails = new List<EmailDetails>();
			List<EmailDetails> removeAccessEmails = new List<EmailDetails>();
			List<SpecificUserPrmission> sharingAddresses = new List<SpecificUserPrmission>();

			// to remove  
			var deleteEmails = existingSpecificUserPrmission.Where(x => specificUserPrmissions.Where(n => n.isDeleted).Select(n => n.userContentSpecificUsersPermissionId).Contains(x.SpecificUserPrmissionId)).ToList();
			if (deleteEmails.Count > 0)
			{
				removeAccessEmails = deleteEmails.Where(x => !string.IsNullOrEmpty(x.Token)).Select(n => new EmailDetails()
				{
					name = n.Name,
					email = n.Email,
				}).ToList();
				await specificUserPrmissionActions.RemoveRangeAsync(deleteEmails);
			}
			foreach (var specificUserPrmission in specificUserPrmissions.Where(x => x.isDeleted != true).ToList())
			{
				// if new email is added
				var token = Guid.NewGuid().ToString();
				if (specificUserPrmission.userContentSpecificUsersPermissionId == 0)
				{
					var userId = (await userOrganizationEmailActions.GetAll().Where(x => x.Email == specificUserPrmission.email).FirstOrDefaultAsync())?.UserId;

					var obj = new SpecificUserPrmission()
					{
						ContentId = userContentId,
						RequestBy = userId,
						Name = specificUserPrmission.name,
						Email = specificUserPrmission.email,
					};
					if (specificUserPrmission.hasAccess.HasValue == true)
					{
						obj.Token = token;
						addedAccessEmails.Add(new EmailDetails()
						{
							name = specificUserPrmission.name,
							email = specificUserPrmission.email,
							token = token,
						});
					}
					await specificUserPrmissionActions.AddAsync(obj);

				}
				else // edit
				{
					var speicificUser = existingSpecificUserPrmission.FirstOrDefault(x => x.SpecificUserPrmissionId == specificUserPrmission.userContentSpecificUsersPermissionId);
					if (specificUserPrmission.hasAccess.HasValue)
					{
						if (specificUserPrmission.hasAccess.Value && string.IsNullOrEmpty(speicificUser.Token))
						{
							// add token and save
							speicificUser.Token = token;

							addedAccessEmails.Add(new EmailDetails()
							{
								name = speicificUser.Name,
								email = speicificUser.Email,
								token = token,
							});
						}
						else if (!specificUserPrmission.hasAccess.Value)
						{
							// remove token and save
							speicificUser.Token = null;
							removeAccessEmails.Add(new EmailDetails()
							{
								name = speicificUser.Name,
								email = speicificUser.Email,
							});
						}
						await specificUserPrmissionActions.UpdateAsync(speicificUser);
					}
				}
			}
			await NotifySpecificUserForLessonAccessAsync(addedAccessEmails, userContentId, AddRemoveStatus.Add);
			await NotifySpecificUserForLessonAccessAsync(removeAccessEmails, userContentId, AddRemoveStatus.Remove);
			return;

		}
		[NonAction]
		public async Task NotifySpecificUserForLessonAccessAsync(List<EmailDetails> emailDetails, int userContentId, AddRemoveStatus type)
		{
			var userContent = await userContentActions.GetAll().Where(x => x.ContentId == userContentId)
				.Include(x => x.User)
				.Include(x => x.Organization)
				.FirstOrDefaultAsync();

			foreach (var emailDetail in emailDetails)
			{
				var link = $"{_appSettings.Domain}/dashboard/course-listing?contentId={userContentId}&token={emailDetail.token}";
				EmailType emailType = EmailType.Invite_User_To_See_Lesson;
				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
			{
							new KeyValuePair<string, string>("[inviteeName]", emailDetail.name),
							new KeyValuePair<string, string>("[userFirstName]", userContent.User.Firstname),
							new KeyValuePair<string, string>("[userLastName]", userContent.User.Firstname),
							new KeyValuePair<string, string>("[orgName]", userContent.Organization.Name),
							new KeyValuePair<string, string>("[lessonName]", userContent.Name),
							new KeyValuePair<string, string>("[link]", link),
						};
				if (type == AddRemoveStatus.Remove)
				{
					emailType = EmailType.Remove_User_To_See_Lesson;
				}

				try
				{
					await mailRepo.SendEmail(emailDetail.email, emailType, replacementDict);
				}
				catch (Exception)
				{
					throw;
				}
			}

		}
		[NonAction]
		private async Task CreateUpdateUserContentMetaAsync(int userContentId, List<UserContentMetaModel> contentMetas)
		{
			var existingProperty = await userContentMetaActions.GetAll().Where(x => x.ContentId == userContentId).ToListAsync();
			if (existingProperty.Count > 0)
			{
				await userContentMetaActions.RemoveRangeAsync(existingProperty);
			}
			List<UserContentMetum> userContentMetaList = new List<UserContentMetum>();

			foreach (var contentMeta in contentMetas)
			{
				userContentMetaList.Add(new UserContentMetum()
				{
					ContentId = userContentId,
					Key = contentMeta.key,
					Value = contentMeta.value,
					MetaType = (int)contentMeta.metaType,
				});
			}
			await userContentMetaActions.AddRangeAsync(userContentMetaList);
			return;

		}
		[NonAction]
		private async Task CreateUpdateAttachmentAsync(int userContentId, int createdBy, List<UserContentAttachments> attachments)
		{
			var existingAttachment = await userContentAttachmentActions.GetAll().Where(x => x.UserContentId == userContentId).ToListAsync();
			if (existingAttachment.Count > 0)
			{
				await userContentAttachmentActions.RemoveRangeAsync(existingAttachment);
			}
			List<UserContentAttachment> userContentAttachments = new List<UserContentAttachment>();
			foreach (var attachment in attachments)
			{
				userContentAttachments.Add(new UserContentAttachment()
				{
					UserContentId = userContentId,
					AttachmentKey = attachment.attachmentKey,
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.ToString(),
				});
			}
			await userContentAttachmentActions.AddRangeAsync(userContentAttachments);
			return;

		}
		[NonAction]
		private async Task CreateUpdateQuestionsAsync(int userContentId, int createdBy, List<UserContentQuestionDTO> questions)
		{
			var existingQuestions = await userContentQuestionActions.GetAll().Where(x => x.UserContentId == userContentId).ToListAsync();
			if (existingQuestions.Count > 0)
			{
				await userContentQuestionActions.RemoveRangeAsync(existingQuestions);
			}
			List<UserContentQuestion> userContentQuestions = new List<UserContentQuestion>();
			foreach (var question in questions)
			{
				userContentQuestions.Add(new UserContentQuestion()
				{
					UserContentId = userContentId,
					Question = question.question,
					QuestionDescription = question.questionDescription,
					Answers = JsonConvert.SerializeObject(question.answers),
					IsMultiselect = question.isMultiSelect.ConvertToUlong(),
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.ToString(),
				});
			}
			await userContentQuestionActions.AddRangeAsync(userContentQuestions);
			return;

		}
		[NonAction]
		private async Task CreateUpdateScratchProjectAsync(int userContentId, int createdBy, List<UserContentScratchProjectDTO> projects)
		{
			var existingprojects = await userContentScratchProjectActions.GetAll().Where(x => x.UserContentId == userContentId).ToListAsync();
			if (existingprojects.Count > 0)
			{
				await userContentScratchProjectActions.RemoveRangeAsync(existingprojects);
			}
			List<UserContentScratchProject> userContentScratchProjects = new List<UserContentScratchProject>();
			foreach (var project in projects)
			{
				userContentScratchProjects.Add(new UserContentScratchProject()
				{
					UserContentId = userContentId,
					Name = project.name,
					Link = project.link,
					CreatedBy = createdBy,
					CreatedDate = DateTime.UtcNow.ToString(),
				});
			}
			await userContentScratchProjectActions.AddRangeAsync(userContentScratchProjects);
			return;

		}
		[NonAction]
		private async Task EnableDisableSharing(int contentId, bool shareWithSpecific)
		{
			List<EmailDetails> emailsToNotify = new List<EmailDetails>();

			var shareWithSpecificList = await specificUserPrmissionActions.GetAll().Where(x => x.ContentId == contentId).ToListAsync();
			if (shareWithSpecific)
			{
				foreach (var item in shareWithSpecificList.Where(x => string.IsNullOrEmpty(x.Token)))
				{
					var token = Guid.NewGuid().ToString();
					emailsToNotify.Add(new EmailDetails()
					{
						name = item.Name,
						email = item.Email,
						token = token,
					});
					item.Token = token;
					await specificUserPrmissionActions.UpdateAsync(item);
				}
				await NotifySpecificUserForLessonAccessAsync(emailsToNotify, contentId, AddRemoveStatus.Add);

			}
			else
			{
				foreach (var item in shareWithSpecificList.Where(n => !string.IsNullOrEmpty(n.Token)).ToList())
				{
					emailsToNotify.Add(new EmailDetails()
					{
						name = item.Name,
						email = item.Email,
					});
					item.Token = null;
					await specificUserPrmissionActions.UpdateAsync(item);
				}
				await NotifySpecificUserForLessonAccessAsync(emailsToNotify, contentId, AddRemoveStatus.Remove);

			}


		}
	}
}
