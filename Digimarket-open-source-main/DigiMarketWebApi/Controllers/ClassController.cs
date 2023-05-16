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
	public class ClassController : BaseController
	{
		private readonly OnGoingClassForUserActions onGoingClassForUserActions;
		private readonly IMailRepo mailRepo;
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly UserContentActions userContentActions;

		public ClassController(OnGoingClassForUserActions onGoingClassForUserActions, IMailRepo _mailRepo, UserOrganizationEmailActions userOrganizationEmailActions, UserContentActions userContentActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			mailRepo = _mailRepo;
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			this.onGoingClassForUserActions = onGoingClassForUserActions;
			this.userContentActions = userContentActions;
		}

		[HttpPost]
		[Route("SaveUserClassStatus")]
		public async Task<dynamic> SaveUserClassStatus(int userId, int courseScheduleDetailsId)
		{
			var userClassStatus = await onGoingClassForUserActions.GetAll().FirstOrDefaultAsync(x => x.CourseScheduleCourseDetailsId == courseScheduleDetailsId && x.UserId == userId);
			if (userClassStatus != null)
			{
				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "User is already in ongoing Class");

			}
			OnGoingClassForUser onGoingClassForUser = new OnGoingClassForUser()
			{
				UserId = userId,
				CourseScheduleCourseDetailsId = courseScheduleDetailsId,
			};
			await onGoingClassForUserActions.AddAsync(onGoingClassForUser);
			return StatusCodes(HttpStatusCode.OK, onGoingClassForUser.OnGoingClassForUserId, "Ongoing Class has been added for User!");

		}

		[HttpPost]
		[Route("UpdateLessonGuid")]
		public async Task<dynamic> UpdateLessonGuid(int lessonId)
		{
			var userClassStatus = await userContentActions.UpdateUserContentGuid(lessonId);
			return StatusCodes(userClassStatus ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, userClassStatus ? "Guid updated!" : "Lesson not found!");

		}
		[HttpDelete]
		[Route("DeleteUserClassStatus")]
		public async Task<dynamic> DeleteUserClassStatus(int OnGoingClassForUserId)
		{
			var OnGoingClassForUser = await onGoingClassForUserActions.Get(OnGoingClassForUserId);

			if (OnGoingClassForUser == null)
			{

				return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Ongoing Class status not found!");

			}
			await onGoingClassForUserActions.RemoveAsync(OnGoingClassForUser);
			return StatusCodes(HttpStatusCode.OK, string.Empty, "Ongoing Class status has been removed for User!");

		}
		[HttpGet]
		[Route("GetUserClassStatus")]
		public async Task<dynamic> GetUserClassStatus(int userId)
		{
			int id = 0;

			if (userId != 0)
			{
				var res = await onGoingClassForUserActions.GetAll().Where(x => x.UserId == userId).FirstOrDefaultAsync();
				if (res!=null)
				{
					id = res.OnGoingClassForUserId;
				}
			}
			return StatusCodes(id != 0 ? HttpStatusCode.BadRequest : HttpStatusCode.OK, id, string.Empty);

		}
	}
}
