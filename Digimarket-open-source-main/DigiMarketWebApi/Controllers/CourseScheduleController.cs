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
using Thirdparty.Mail;
using Thirdparty.Helper;
using System.Collections;
using DbRepository.Modules;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using DataTransferObject;

namespace DigiMarketWebApi.Controllers
{
	public class CourseScheduleController : BaseController
	{
		private readonly IMailRepo mailRepo;
        private readonly UserOrganizationEmailActions userOrganizationEmailActions;
        private readonly UsernameLoginStudentOrganizationActions usernameLoginStudentOrganizationActions;
		private readonly UsernameLoginStudentActions usernameLoginStudentActions;
		private readonly CourseScheduleActions courseScheduleActions;
		private readonly CourseScheduleMemberActions courseScheduleMemberActions;
		private readonly CourseScheduleCourseDetailActions courseScheduleCourseDetailActions;
		private readonly UserActions userActions;
		private readonly UserContentActions userContentActions;
		private readonly UserOrganizationActions userOrganizationActions;
		public CourseScheduleController(UserOrganizationEmailActions userOrganizationEmailActions, UsernameLoginStudentOrganizationActions usernameLoginStudentOrganizationActions, UsernameLoginStudentActions usernameLoginStudentActions, CourseScheduleActions courseScheduleActions, IMailRepo _mailRepo, CourseScheduleMemberActions courseScheduleMemberActions, CourseScheduleCourseDetailActions courseScheduleCourseDetailActions, UserActions userActions, UserContentActions userContentActions, UserOrganizationActions userOrganizationActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			this.usernameLoginStudentOrganizationActions = usernameLoginStudentOrganizationActions;
			this.usernameLoginStudentActions = usernameLoginStudentActions;
			this.courseScheduleActions = courseScheduleActions;
			mailRepo = _mailRepo;
			this.courseScheduleMemberActions = courseScheduleMemberActions;
			this.courseScheduleCourseDetailActions = courseScheduleCourseDetailActions;
			this.userActions = userActions;
			this.userContentActions = userContentActions;
			this.userOrganizationActions = userOrganizationActions;
		}
		[HttpPost]
		[Route("AddSchedule")]
		public async Task<dynamic> AddScheduleAsync(AddCourseScheduleDTO courseScheduleDTO)
		{
			HttpStatusCode statusCode = HttpStatusCode.OK;

			string msg = string.Empty;
			string resp = "Schedule Added!";
			var courseSchedule = await courseScheduleActions.GetById(courseScheduleDTO.courseScheduleId);
			var trans = courseScheduleActions.BeginTransaction();
			if (courseSchedule == null)
			{
				var courseScheduleObj = new CourseSchedule()
				{
					CourseId = courseScheduleDTO.courseId,
					OrganizationId = courseScheduleDTO.organizationId,
					CreatedBy = courseScheduleDTO.createdBy,
					CreatedDate = DateTime.UtcNow.ToString(),
				};
				await courseScheduleActions.AddAsync(courseScheduleObj);
				int courseScheduleId = courseScheduleObj.CourseScheduleId;
				msg = await AddUpdateCourseScheduleDetailsAsync(courseScheduleDTO.courseScheduleDetails, courseScheduleId, courseScheduleDTO.createdBy, courseScheduleDTO.organizationId);
			}
			else
			{
				msg = await AddUpdateCourseScheduleDetailsAsync(courseScheduleDTO.courseScheduleDetails, courseScheduleDTO.courseScheduleId, courseSchedule.CreatedBy, courseScheduleDTO.organizationId);
				resp = "Updated!";
			}
			if (!string.IsNullOrEmpty(msg))
			{
				statusCode = HttpStatusCode.BadRequest;
				resp = msg;
				trans.Rollback();
			}
			else
			{
				trans.Commit();
			}
			trans.Dispose();
			return StatusCodes(statusCode, string.Empty, resp);

		}

		[HttpGet]
		[Route("GetCourseSchedules")]
		public async Task<dynamic> GetCourseSchedulesAsync(int offset, int limit, int organizationId, int shceduleId = 0)
		{
			limit = limit == 0 ? 10 : limit; // default limit is 10 
			Expression<Func<CourseSchedule, bool>> wherePredicate = x =>
							(shceduleId != 0 && x.CourseScheduleId == shceduleId)
							||
							(shceduleId == 0 && organizationId != 0 && x.OrganizationId == organizationId);
			var courseSchedules = await courseScheduleActions.GetAll().Where(wherePredicate).Skip(offset).Take(limit)
		.Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.UserContent)
		.Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
		.Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.Teacher)
		.Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.Location)
		.Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
		.Include(x => x.Course)
		.ToListAsync();
			List<GetCourseScheduleDTO> courseScheduleDetails = new List<GetCourseScheduleDTO>();

			if (courseSchedules != null)
			{
				courseSchedules.ForEach(x =>
				{
					// details about schedule
					GetCourseScheduleDTO getCourseScheduleDTO = new GetCourseScheduleDTO
					{
						organizationId = x.OrganizationId,
						courseScheduleId = x.CourseScheduleId,
						courseId = x.CourseId,
						courseName = x.Course.CourseName,
						createdBy = x.CreatedBy,
						courseScheduleDeatilList = GetCourseScheduleDetails(x.CourseScheduleCourseDetails.ToList()),
					};
					courseScheduleDetails.Add(getCourseScheduleDTO);
				});
				courseScheduleDetails = courseScheduleDetails.OrderByDescending(x => x.courseScheduleDeatilList?.FirstOrDefault()?.dateTime).ToList();
				return StatusCode(200, new
				{
					statusCode = 200,
					result = courseScheduleDetails,
					message = $"{courseScheduleDetails.Count} Course Schedule(s) found"
				});
			}
			else
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "Course Schedule not Found against the given Organization/ Schedule Id!"
				});
			}
		}

		[HttpGet]
		[Route("GetScheduledLessonByTeacher")]
		public async Task<dynamic> GetScheduledLessonByTeacher(int teacherId, int organizationId, bool isCourseView = false)
		{
			var isUserExist = await userActions.IsExist(teacherId);
			if (!isUserExist)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Not Found!"
				});
			}
			var schedules = await courseScheduleCourseDetailActions.GetAll().Where(x => x.TeacherId == teacherId && x.CourseSchedule.OrganizationId == organizationId)
				.Include(x => x.UserContent)
				.Include(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
				.Include(x => x.Teacher)
				.Include(x => x.Location)
				.Include(x => x.CourseSchedule).ThenInclude(x => x.Course)
				.Include(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
				.ToListAsync();

			var details = GetCourseScheduleDetails(schedules);
			dynamic res;
			if (isCourseView == true)
			{
				res = GetCourseDeatils(details);
			}
			else
			{
				res = details;
			}

			return StatusCodes(HttpStatusCode.OK, res, $"{res.Count} Schedules Found!");

		}
		[HttpGet]
		[Route("GetScheduledLessonByStudent")]
		public async Task<dynamic> GetScheduledLessonByStudent(int studentId, int organizationId, bool isCourseView = false)
		{
			var isUserExist = await userActions.IsExist(studentId);
			if (!isUserExist)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Not Found!"
				});
			}
			var schedules = await courseScheduleCourseDetailActions.GetAll().Where(x => x.CourseSchedule.OrganizationId == organizationId && x.CourseScheduleMembers.Any(n => n.UserId == studentId && n.MemberType == (int)MemberType.Participants))
				.Include(x => x.UserContent)
				.Include(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
				.Include(x => x.Teacher)
				.Include(x => x.Location)
				.Include(x => x.CourseSchedule).ThenInclude(x => x.Course)
				.Include(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
				.ToListAsync();
			var details = GetCourseScheduleDetails(schedules);
			dynamic res;
			if (isCourseView == true)
			{
				res = GetCourseDeatils(details);
			}
			else
			{
				res = details;
			}
			return StatusCodes(HttpStatusCode.OK, res, $"{res.Count} Schedules Found!");

		}

		[HttpGet]
		[Route("GetScheduledLessonByTeam")]
		public async Task<dynamic> GetScheduledLessonByTeam(int teamParticipantId, int organizationId, bool isCourseView = false)
		{
			var isUserExist = await userActions.IsExist(teamParticipantId);
			if (!isUserExist)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Not Found!"
				});
			}
			var schedules = await courseScheduleCourseDetailActions.GetAll().Where(x => x.CourseSchedule.OrganizationId == organizationId && x.CourseScheduleMembers.Any(n => n.UserId == teamParticipantId && n.MemberType == (int)MemberType.Team))
				.Include(x => x.UserContent)
				.Include(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
				.Include(x => x.Teacher)
				.Include(x => x.Location)
				.Include(x => x.CourseSchedule).ThenInclude(x => x.Course)
				.Include(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
				.ToListAsync();
			var details = GetCourseScheduleDetails(schedules);
			dynamic res;
			if (isCourseView == true)
			{
				res = GetCourseDeatils(details);
			}
			else
			{
				res = details;
			}
			return StatusCodes(HttpStatusCode.OK, res, $"{res.Count} Schedules Found!");

		}

		[HttpGet]
		[Route("GetScheduledLessonByParent")]
		public async Task<dynamic> GetScheduledLessonByParent(int parentId, int organizationId, bool isCourseView = false)
		{
			var isUserExist = await userActions.IsExist(parentId);
			if (!isUserExist)
			{
				return StatusCode(404, new
				{
					statusCode = 404,
					result = "",
					message = "User Not Found!"
				});
			}
			var studentList = await usernameLoginStudentOrganizationActions.GetStudentsbyParent(parentId, organizationId);
			var schedules = await courseScheduleCourseDetailActions.GetAll().Where(x => x.CourseSchedule.OrganizationId == organizationId && x.CourseScheduleMembers.Any(n => studentList.Contains(n.UserId) && n.MemberType == (int)MemberType.Participants))
				.Include(x => x.UserContent)
				.Include(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
				.Include(x => x.Teacher)
				.Include(x => x.Location)
				.Include(x => x.CourseSchedule).ThenInclude(x => x.Course)
				.Include(x => x.CourseScheduleMembers).ThenInclude(n => n.User)
				.ToListAsync();
			var details = GetCourseScheduleDetails(schedules);
			dynamic res;
			if (isCourseView == true)
			{
				res = GetCourseDeatils(details);
			}
			else
			{
				res = details;
			}
			return StatusCodes(HttpStatusCode.OK, res, $"{res.Count} Schedules Found!");
		}
		
		[NonAction]
		private async Task AddUpdateTeamOrParticipants(List<int> ids, int courseScheduleCourseDetails, MemberType memberType, DateTime? dateTime)
		{
			try
			{
				ids ??= new List<int>();
				List<int> memberIds = new List<int>();
				foreach (var id in ids)
				{
					if (await CheckMemberAvailabilityAsync(courseScheduleCourseDetails, id, dateTime, memberType))
					{
						memberIds.Add(id);
					}
					else
					{
						throw new Exception($"{memberType} ");
					}
				}

				var members = await courseScheduleMemberActions.GetMembers(courseScheduleCourseDetails, (int)memberType);
				if (members.Count > 0)
				{
					await courseScheduleMemberActions.RemoveRangeAsync(members);
				}
				List<CourseScheduleMember> courseScheduleMembers = new List<CourseScheduleMember>();
				if (memberIds != null && memberIds.Count > 0)
				{
					memberIds.ForEach(x =>
					{
						courseScheduleMembers.Add(new CourseScheduleMember()
						{
							CourseScheduleCourseDetails = courseScheduleCourseDetails,
							UserId = x,
							MemberType = (int)memberType
						});
					});
				}

				await courseScheduleMemberActions.AddRangeAsync(courseScheduleMembers);
			}
			catch (Exception)
			{

				throw;
			}


		}
		[NonAction]
		public async Task<string> AddUpdateCourseScheduleDetailsAsync(List<AddCourseScheduleDetails> courseScheduleDetails, int courseScheduleId, int userId,int organizationId)
		{

			string msg = string.Empty;
			// save CoruseScheduleDetails
			List<CourseScheduleCourseDetail> schdeduleDeatils = new List<CourseScheduleCourseDetail>();
			foreach (var courseScheduleDetail in courseScheduleDetails)
			{
				try
				{
					var locationAvailable = await CheckLocationAvailabilityAsync(courseScheduleDetail);
					if (!locationAvailable)
					{
						msg += $"location is not availble at {courseScheduleDetail.dateTime} for lesson:{courseScheduleDetail.lessonName}";
						break;
					}
					var teacherAvailable = await CheckTeacherAvailabilityAsync(courseScheduleDetail);
					if (!teacherAvailable)
					{
						msg += $"Teacher is not availble at {courseScheduleDetail.dateTime} for lesson:{courseScheduleDetail.lessonName}";
						break;
					}
					int courseScheduleCourseDetailsId = 0;
					var existingCurseScheduleDetails = await courseScheduleCourseDetailActions.Get(courseScheduleDetail.courseScheduleCourseDetailsId);
					if (existingCurseScheduleDetails != null)
					{
						existingCurseScheduleDetails.CourseScheduleId = courseScheduleId;
						existingCurseScheduleDetails.DateTime = courseScheduleDetail.dateTime.Value.ConvertToString();
						existingCurseScheduleDetails.LocationId = courseScheduleDetail.locationId;
						existingCurseScheduleDetails.MaxParticipantsCount = courseScheduleDetail.maxParticipantsCount;
						existingCurseScheduleDetails.ParticipantNotificationThreshold = courseScheduleDetail.participantNotificationThreshold;
						existingCurseScheduleDetails.TeacherId = courseScheduleDetail.teacherId;

						await courseScheduleCourseDetailActions.UpdateAsync(existingCurseScheduleDetails);
						courseScheduleCourseDetailsId = existingCurseScheduleDetails.CourseScheduleCourseDetailsId;
					}
					else
					{
						var obj = new CourseScheduleCourseDetail()
						{
							CourseScheduleId = courseScheduleId,
							DateTime = courseScheduleDetail.dateTime.Value.ConvertToString(),
							LocationId = courseScheduleDetail.locationId,
							MaxParticipantsCount = courseScheduleDetail.maxParticipantsCount,
							ParticipantNotificationThreshold = courseScheduleDetail.participantNotificationThreshold,
							TeacherId = courseScheduleDetail.teacherId,
							UserContentId = courseScheduleDetail.userContentId,
						};
						await courseScheduleCourseDetailActions.AddAsync(obj);
						courseScheduleCourseDetailsId = obj.CourseScheduleCourseDetailsId;
					}

					// add participents 

					await AddUpdateTeamOrParticipants(courseScheduleDetail.participantIds, courseScheduleCourseDetailsId, MemberType.Participants, courseScheduleDetail.dateTime);
					// add team
					await AddUpdateTeamOrParticipants(courseScheduleDetail.teamIds, courseScheduleCourseDetailsId, MemberType.Team, courseScheduleDetail.dateTime);

					// check no of participants
					await CheckParticipantsAndNotifyAsync(courseScheduleCourseDetailsId, userId,organizationId);

				}

				catch (Exception ex)
				{
					return $"{ex.Message} is not availble at {courseScheduleDetail.dateTime} for lesson:{courseScheduleDetail.lessonName}";
				}

			}
			return msg;


		}
		[NonAction]
		private async Task CheckParticipantsAndNotifyAsync(int courseSceduleDetailId, int userId,int organizationId)
		{
			var courseSchedule = await courseScheduleCourseDetailActions.GetById(courseSceduleDetailId);

			var threshold = courseSchedule.ParticipantNotificationThreshold ?? 0;
			var participants = courseSchedule.CourseScheduleMembers.Count(x => x.MemberType == (int)MemberType.Participants);
			if (participants >= threshold)
			{
				var lessonDetails = $"{courseSchedule.DateTime.ConvertToDateTime()} delivered by {courseSchedule.Teacher?.Firstname + " " + courseSchedule.Teacher?.Lastname} at {courseSchedule.Location?.Location}";				
				try
				{
					var emails = await GetEmailsWhoHasManageSchedulePermissionAsync(organizationId);
					//var emails =await userOrganizationEmailActions.GetEmailsByOrganizationForNotifications(new List<int> { userId }, organizationId);
					foreach (var emailDetails in emails)
					{

						List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>("[firstName]", emailDetails.firstName),
							new KeyValuePair<string, string>("[lastName]", emailDetails.lastName),
							new KeyValuePair<string, string>("[lessonName]", courseSchedule.UserContent?.Name),
							new KeyValuePair<string, string>("[lessonDeatils]", lessonDetails),
							new KeyValuePair<string, string>("[participantsCount]", participants.ToString()),
							new KeyValuePair<string, string>("[threshold]", threshold.ToString()),
							new KeyValuePair<string, string>("[maxParticipants]", courseSchedule.MaxParticipantsCount.ToString()),
						};
						await mailRepo.SendEmail(emailDetails.email, EmailType.Max_Participants_Notification, replacementDict);
                    }
                }
				catch (Exception)
				{
					throw;
				}
				// send email
			}

		}
		[NonAction]
		public List<ObjectInfo> GetMembers(List<CourseScheduleMember> courseScheduleMembers, MemberType type)
		{
			var members = new List<ObjectInfo>();
			var courseParticipants = courseScheduleMembers.Where(x => x.MemberType == (int)type).ToList();
			if (courseParticipants.Count > 0)
			{
				courseParticipants.ForEach(n =>
				{
					members.Add(new ObjectInfo()
					{
						id = n.User.UserId,
						name = n.User.Firstname + n.User.Lastname
					});
				});
			}
			return members;
		}
		[NonAction]
		public List<GetCourseScheduleDetails> GetCourseScheduleDetails(List<CourseScheduleCourseDetail> courseScheduleCourseDetails)
		{
			List<GetCourseScheduleDetails> getCourseScheduleDetails = new List<GetCourseScheduleDetails>();
			foreach (var courseScheduleDetail in courseScheduleCourseDetails)
			{
				var participants = GetMembers(courseScheduleDetail.CourseScheduleMembers.ToList(), MemberType.Participants);
				var team = GetMembers(courseScheduleDetail.CourseScheduleMembers.ToList(), MemberType.Team);

				getCourseScheduleDetails.Add(new GetCourseScheduleDetails()
				{
					courseId = courseScheduleDetail.CourseSchedule?.CourseId,
					courseName = courseScheduleDetail.CourseSchedule.Course?.CourseName,
					courseScheduleCourseDetailsId = courseScheduleDetail.CourseScheduleCourseDetailsId,
					dateTime = courseScheduleDetail.DateTime.ConvertToDateTime(),
					location = courseScheduleDetail.LocationId == null ? null : new ObjectInfo() { id = courseScheduleDetail.Location.CourseLocationId, name = courseScheduleDetail.Location.Location, description = courseScheduleDetail.Location.Details },
					maxParticipantsCount = courseScheduleDetail.MaxParticipantsCount,
					participantNotificationThreshold = courseScheduleDetail.ParticipantNotificationThreshold,
					participants = participants,
					team = team,
					teacher = courseScheduleDetail.TeacherId == null ? null : new ObjectInfo() { id = courseScheduleDetail.Teacher.UserId, name = courseScheduleDetail.Teacher.Firstname + " " + courseScheduleDetail.Teacher.Lastname },
					userContent = GetUserContentWithMeta(courseScheduleDetail.UserContent),
					userContentId = courseScheduleDetail.UserContentId,
					locationId = courseScheduleDetail.LocationId,
					lessonGuid = courseScheduleDetail.UserContent.UserContentGuid,
				});
			}
			return getCourseScheduleDetails.OrderBy(x => x.dateTime.Value).ToList();
		}
		[NonAction]
		public async Task<bool> CheckLocationAvailabilityAsync(AddCourseScheduleDetails courseScheduleDetail)
		{
			var res = (await GetCourseDeatilsAsync(courseScheduleDetail.courseScheduleCourseDetailsId)).Any(n => CheckDateOccupied(n, courseScheduleDetail.dateTime) && n.LocationId == courseScheduleDetail.locationId);
			return !res;
		}
		[NonAction]
		public async Task<bool> CheckTeacherAvailabilityAsync(AddCourseScheduleDetails courseScheduleDetail)
		{
			var res = (await GetCourseDeatilsAsync(courseScheduleDetail.courseScheduleCourseDetailsId)).Any(n => CheckDateOccupied(n, courseScheduleDetail.dateTime) && n.TeacherId == courseScheduleDetail.teacherId);
			return !res;
		}
		[NonAction]
		public async Task<bool> CheckMemberAvailabilityAsync(int courseScheduleDetailId, int? memberId, DateTime? dateTime, MemberType memberType)
		{
			var res = (await GetCourseDeatilsAsync(courseScheduleDetailId)).Any(n => CheckDateOccupied(n, dateTime) && (n.TeacherId == memberId || n.CourseScheduleMembers.Any(p => p.UserId == memberId && p.MemberType == (int)memberType)));

			return !res;
		}
		[NonAction]
		public bool CheckDateOccupied(CourseScheduleCourseDetail lesson, DateTime? dateTime)
		{
			var userContent = userContentActions.GetAll().Where(x => x.ContentId == lesson.UserContentId).Include(x => x.UserContentMeta).FirstOrDefault();
			var durationInMins = int.Parse(userContent.UserContentMeta.FirstOrDefault(x => x.Key.ToLower().Contains("duration")).Value);
			var startTime = lesson.DateTime.ConvertToDateTime();
			var endTime = startTime.AddMinutes(durationInMins);
			var currentTime = dateTime.Value.RemoveSeconds();
			var res = currentTime >= startTime && currentTime <= endTime;
			return res;
		}
		[NonAction]
		public async Task<List<CourseScheduleCourseDetail>> GetCourseDeatilsAsync(int id)
		{
			var list = await courseScheduleCourseDetailActions.GetAll().Where(n => n.CourseScheduleCourseDetailsId != id).Include(x => x.CourseScheduleMembers).ToListAsync();
			return list ?? new List<CourseScheduleCourseDetail>();

		}
		[NonAction]
		public List<GetCourseSchduleDetailsCourseView> GetCourseDeatils(List<GetCourseScheduleDetails> courseScheduleDetails)
		{
			List<GetCourseSchduleDetailsCourseView> courseSchduleDetailsCourseView = new List<GetCourseSchduleDetailsCourseView>();
			var groupedData = courseScheduleDetails.GroupBy(x => new { x.courseId, x.courseName }).ToList();

			foreach (var courseScheduleDetailGrouped in groupedData)
			{
				var courseScheduleDetailsList = new List<GetCourseScheduleDetails>();

				foreach (var courseScheduleDetail in courseScheduleDetailGrouped)
				{
					courseScheduleDetailsList.Add(courseScheduleDetail);
				}
				courseSchduleDetailsCourseView.Add(new GetCourseSchduleDetailsCourseView()
				{
					courseName = courseScheduleDetailGrouped.Key.courseName,
					courseId = courseScheduleDetailGrouped.Key.courseId,
					courseScheduleDetails = courseScheduleDetailsList,
				});

			}
			return courseSchduleDetailsCourseView;


		}
		[NonAction]
		public async Task<List<EmailWithUserDTO>> GetEmailsWhoHasManageSchedulePermissionAsync(int organizationId)
		{
			var res = await userOrganizationActions.GetEmailsWhoHasManageSchedulePermissionAsync(organizationId);
			if (!res.success)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, res.msg);
			}
			return res.emails ?? new List<EmailWithUserDTO>();
		}

	}
}
