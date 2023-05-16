using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Net;
using Thirdparty.Helper;
using Thirdparty.Mail;
using DbRepository.Modules;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Core.Helper;

namespace DigiMarketWebApi.Controllers
{    
    public class AttendanceController : BaseController
    {
		private readonly UsernameLoginStudentActions usernameLoginStudentActions;
		private readonly CourseScheduleMemberActions courseScheduleMemberActions;
		private readonly CourseScheduleAttendanceAction courseScheduleAttendanceAction;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly IMailRepo mailRepo;
        public AttendanceController(UsernameLoginStudentActions usernameLoginStudentActions, CourseScheduleMemberActions courseScheduleMemberActions, CourseScheduleAttendanceAction courseScheduleAttendanceAction, IMailRepo _mailRepo, UserOrganizationEmailActions userOrganizationEmailActions) : base(_mailRepo, userOrganizationEmailActions)
        {
            this.usernameLoginStudentActions = usernameLoginStudentActions;
            this.courseScheduleMemberActions = courseScheduleMemberActions;
            this.courseScheduleAttendanceAction = courseScheduleAttendanceAction;
            mailRepo = _mailRepo;
            this.userOrganizationEmailActions = userOrganizationEmailActions;
        }

        [HttpPost]
		[Route("MarkAttendance")]
		public async Task<dynamic> AddUpdateAttendance(List<AttendanceDTO> model)
		{
			foreach (var attendance in model)
			{
				var attendanceObj = await courseScheduleAttendanceAction.Get(attendance.CourseScheduleAttendanceId);
				if (attendanceObj == null)
				{
					CourseScheduleAttendance courseScheduleAttendance= new CourseScheduleAttendance()
					{
						CourseScheduleCourseDetailsId= attendance.CourseScheduleCourseDetailsId,
						UserId=attendance.UserId,
						IsPresent = attendance.IsPresent.ConvertToUlong(),
						CreatedBy = attendance.MarkedBy,
						CreatedDate = DateTime.UtcNow.ToString()
					};
					await courseScheduleAttendanceAction.AddAsync(courseScheduleAttendance);
				}
				else
				{
					attendanceObj.IsPresent = attendance.IsPresent.ConvertToUlong();
					await courseScheduleAttendanceAction.UpdateAsync(attendanceObj);
				}
			}
			return StatusCodes(HttpStatusCode.OK, string.Empty, "Attendance Marked");

		}
		[HttpGet]
		[Route("GetAttendaceByScheduledLesson")]
		public async Task<dynamic> GetAttendaceByScheduledLesson(int CourseScheduleCourseDetailsId)
		{
			var attendanceList = await courseScheduleAttendanceAction.GetAll().Where(x=>x.CourseScheduleCourseDetailsId == CourseScheduleCourseDetailsId).Select(x=> new AttendanceDTO()
			{
				CourseScheduleAttendanceId= x.CourseScheduleAttendanceId,
				CourseScheduleCourseDetailsId= x.CourseScheduleCourseDetailsId,
				UserId=x.UserId,
				IsPresent = x.IsPresent.ConvertToBool(),
			}).ToListAsync();
			if (attendanceList != null)
			{

				return StatusCodes(HttpStatusCode.OK, attendanceList, $"{attendanceList.Count} Attendance Found!");

			}
			return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Attendance Not Found!");
			
		}
		[HttpGet]
		[Route("GetMembersForAttendance")]
		public async Task<dynamic> GetMembersForAttendance(int courseScheduleCourseDetailId)
		{
			var list = courseScheduleMemberActions.GetAll().Where(x => x.CourseScheduleCourseDetails == courseScheduleCourseDetailId)
				.Include(x => x.User).ToList();
			List<GetMemberForAttendanceDTO> members = new List<GetMemberForAttendanceDTO>();
			foreach (var item in list)
			{
				var attendanceData = await courseScheduleAttendanceAction.GetAttendaceStatus(item.UserId, courseScheduleCourseDetailId);
				members.Add(new GetMemberForAttendanceDTO()
				{
					userId = item.UserId,
					firstName = item.User.Firstname,
					lastName = item.User.Lastname,
					dob = item.User.Dob,
					image = item.User.Image,
					type = item.MemberType == (int)MemberType.Participants ? "Student" : "Additional Participant",
					parentName = await usernameLoginStudentActions.GetLinkedParentName(item.UserId), 
					status= attendanceData.status,
					attendanceId = attendanceData.id,
                });
			}
			return members;
		}

	}
}
