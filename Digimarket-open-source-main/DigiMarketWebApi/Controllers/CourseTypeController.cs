using DbRepository.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DigiMarketWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Thirdparty.Mail;
using Thirdparty.Helper;
using System.Net;
using DbRepository.Modules;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Controllers
{

    public class CourseTypeController : BaseController
    {
        private readonly UserContentActions userContentActions;
        private readonly CourseActions courseActions;
        private readonly CourseLessonActions courseLessonActions;
        private readonly CourseScheduleActions courseScheduleActions;
        private readonly UserOrganizationEmailActions userOrganizationEmailActions;

        public CourseTypeController(UserContentActions userContentActions, CourseActions courseActions, IMailRepo _mailRepo, CourseLessonActions courseLessonActions, CourseScheduleActions courseScheduleActions, UserOrganizationEmailActions userOrganizationEmailActions) : base(_mailRepo, userOrganizationEmailActions)
        {
            this.userContentActions = userContentActions;
            this.courseActions = courseActions;
            this.courseLessonActions = courseLessonActions;
            this.courseScheduleActions = courseScheduleActions;
            this.userOrganizationEmailActions = userOrganizationEmailActions;
        }
        [HttpGet]
        [Route("GetLessons")]
        public async Task<dynamic> GetLessonsAsync(int organizationId)
        {
            var lessons = (await userContentActions.GetByOrganizationId(organizationId)).Select(x => new
            {
                x.Name,
                x.ContentId,
            }).ToList();
            if (lessons != null)
            {
                return StatusCode(200, new
                {
                    statusCode = 200,
                    result = lessons,
                    message = $"{lessons.Count} lesson(s) found"
                });
            }
            else
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = "",
                    message = "Lessons not Found against the given organization!"
                });
            }
        }
        [HttpGet]
        [Route("GetCourses")]
        public async Task<dynamic> GetCoursesAsync(int offset, int limit, int organziationId, int courseId = 0)
        {
            limit = limit == 0 ? 10 : limit; // default limit is 10 
            Expression<Func<Course, bool>> wherePredicate = x =>
                            (courseId != 0 && x.CourseId == courseId)
                            ||
                            (courseId == 0 && organziationId != 0 && x.OrganizationId == organziationId);
            var courses = await courseActions.GetAll().Where(wherePredicate).Skip(offset).Take(limit)
                .Include(x => x.CourseLessons).ThenInclude(x => x.UserContent).ThenInclude(x => x.UserContentMeta)
                .ToListAsync();
            List<CourseDetailsDTO> courseDetails = new List<CourseDetailsDTO>();

            if (courses != null)
            {
                courses.ForEach(x =>
                {
                    courseDetails.Add(CreateCourseDetails(x));
                });
                return StatusCode(200, new
                {
                    statusCode = 200,
                    result = courseDetails,
                    message = $"{courseDetails.Count} Course(s) found"
                });
            }
            else
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = "",
                    message = "Lessons not Found against the given Organization/ Course Id!"
                });
            }
        }


        [HttpPost]
        [Route("AddCourse")]
        public async Task<dynamic> AddCourseAsync(AddCourseDTO addCourseDTO)
        {
            int courseId = 0;
            string msg = string.Empty;
            Course course = await courseActions.Get(addCourseDTO.courseId);
            if (course == null)
            {
                var courseObj = new Course()
                {
                    CourseName = addCourseDTO.courseName,
                    CourseDescription = addCourseDTO.courseDescription,
                    OrganizationId = addCourseDTO.organizatoinId,
                    CreatedBy = addCourseDTO.userId,
                    CreatedDate = DateTime.UtcNow.ConvertToString(),
                };
                await courseActions.AddAsync(courseObj);
                courseId = courseObj.CourseId;
            }
            else
            {
                var res = await CheckIfCourseScheduleIsOngingAsync(course.CourseId);
                if (res)
                {
                    return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Can not edit ongoing or future scheduled course!");
                }
                else
                {
                    course.CourseName = addCourseDTO.courseName;
                    course.CourseDescription = addCourseDTO.courseDescription;
                    await courseActions.UpdateAsync(course);
                    courseId = course.CourseId;

                }
            }
            await CreateUpdateLessonsAsync(courseId, addCourseDTO.lessonIds);

            return StatusCodes(HttpStatusCode.OK, string.Empty, "Course Created/Updated!");


        }
        [NonAction]
        private async Task CreateUpdateLessonsAsync(int courseId, List<int> lessonsIds)
        {
            var existingCourse = await courseLessonActions.GetAll().Where(x => x.CourseId == courseId).ToListAsync();
            if (existingCourse.Count > 0)
            {
                await courseLessonActions.RemoveRangeAsync(existingCourse);
            }
            List<CourseLesson> courseLessons = new List<CourseLesson>();
            foreach (var lessonsId in lessonsIds)
            {
                courseLessons.Add(new CourseLesson()
                {
                    UserContentId = lessonsId,
                    CourseId = courseId,
                });
            }
            await courseLessonActions.AddRangeAsync(courseLessons);
            return;

        }

        [NonAction]
        private CourseDetailsDTO CreateCourseDetails(Course course)
        {
            List<UserContentGetModel> userContents = new List<UserContentGetModel>();
            course.CourseLessons.ToList().ForEach(x =>
            userContents.Add(GetUserContentWithMeta(x.UserContent)));
            return (new CourseDetailsDTO()
            {
                courseId = course.CourseId,
                courseName = course.CourseName,
                courseDescription = course.CourseDescription,
                organizatoinId = course.OrganizationId,
                userId = course.CreatedBy,
                lessons = userContents ?? new List<UserContentGetModel>()

            });
        }
        [NonAction]
        public async Task<bool> CheckIfCourseScheduleIsOngingAsync(int courseId)
        {
            bool res = false;
            var schedules =await courseScheduleActions.GetAll().Where(x => x.CourseId == courseId)
                .Include(x => x.CourseScheduleCourseDetails)
                .Include(x => x.CourseScheduleCourseDetails).ThenInclude(x => x.UserContent).ThenInclude(x => x.UserContentMeta)

                .ToListAsync();
            foreach (var schedule in schedules)
            {
                var minTime = schedule.CourseScheduleCourseDetails.Min(x => x.DateTime.ConvertToDateTime());
                var maxTime = schedule.CourseScheduleCourseDetails.Max(x => x.DateTime.ConvertToDateTime().AddMinutes(int.Parse(x.UserContent.UserContentMeta.FirstOrDefault(x => x.Key.ToLower().Contains("duration")).Value)));
                var currentTime = DateTime.UtcNow;
                res = (minTime > currentTime) || (currentTime >= minTime && currentTime <= maxTime);
                if (res)
                {
                    break;
                }
            }

            return res;
        }
    }
}
