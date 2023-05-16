using DbRepository.Models;
using System;
using System.Collections.Generic;

namespace DigiMarketWebApi.Models
{
    public class AddCourseDTO
    {
        public int courseId { get; set; }
        public string courseName { get; set; }
        public string courseDescription { get; set; }
        public List<int> lessonIds { get; set; }
        public int organizatoinId { get; set; }
        public int userId { get; set; }
    }
    public class CourseDetailsDTO
    {
        public int courseId { get; set; }
        public string courseName { get; set; }
        public string courseDescription { get; set; }
        public List<UserContentGetModel> lessons { get; set; }
        public int organizatoinId { get; set; }
        public int organizatoinName { get; set; }
        public int userId { get; set; }
    }
    public class ObjectInfo
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
    public class CourseScheduleDTO
    {
        public int courseScheduleId { get; set; }
        public int courseId { get; set; }
        public int organizationId { get; set; }
        public int createdBy { get; set; }
    }
    public class AddCourseScheduleDTO : CourseScheduleDTO
    {
        public List<AddCourseScheduleDetails> courseScheduleDetails { get; set; }
    }
    public class CourseScheduleDetails
    {
        public int? courseId { get; set; }
        public string courseName { get; set; }
        public int courseScheduleCourseDetailsId { get; set; }
        public int userContentId { get; set; }
        public int? locationId { get; set; }
        public DateTime? dateTime { get; set; }
        public int? maxParticipantsCount { get; set; }
        public int? participantNotificationThreshold { get; set; }
        public string lessonGuid { get; set; }

    }
    public class AddCourseScheduleDetails : CourseScheduleDetails
    {
        public int? teacherId { get; set; }
        public List<int> teamIds { get; set; }
        public List<int> participantIds { get; set; }
        public string lessonName { get; set; }
    }
    public class GetCourseScheduleDetails : CourseScheduleDetails
    {

        public ObjectInfo teacher { get; set; }
        public List<ObjectInfo> team { get; set; }
        public List<ObjectInfo> participants { get; set; }
        public ObjectInfo location { get; set; }
        public UserContentGetModel userContent { get; set; }
    }
    public class GetCourseSchduleDetailsCourseView
    {
        public string courseName { get; set; }
        public int? courseId { get; set; }
        public List<GetCourseScheduleDetails> courseScheduleDetails { get; set; }
    }
    public class GetCourseScheduleDTO : CourseScheduleDTO
    {
        public List<GetCourseScheduleDetails> courseScheduleDeatilList { get; set; }
        public string courseName { get; set; }  
    }
    public class GetMemberForAttendanceDTO
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string dob { get; set; }
        public string parentName { get; set; }
        public string image { get; set; }
        public string type { get; set; }
        public int userId { get; set; }
        public string status { get; set; }
        public int attendanceId{ get; set; }
    }

}
