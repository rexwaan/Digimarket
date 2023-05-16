using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseScheduleCourseDetail
    {
        public CourseScheduleCourseDetail()
        {
            CourseScheduleAttendances = new HashSet<CourseScheduleAttendance>();
            CourseScheduleMembers = new HashSet<CourseScheduleMember>();
            OnGoingClassForUsers = new HashSet<OnGoingClassForUser>();
        }

        public int CourseScheduleCourseDetailsId { get; set; }
        public int CourseScheduleId { get; set; }
        public int UserContentId { get; set; }
        public int? LocationId { get; set; }
        public string DateTime { get; set; }
        public int? TeacherId { get; set; }
        public int? MaxParticipantsCount { get; set; }
        public int? ParticipantNotificationThreshold { get; set; }

        public virtual CourseSchedule CourseSchedule { get; set; }
        public virtual CourseLocation Location { get; set; }
        public virtual User Teacher { get; set; }
        public virtual UserContent UserContent { get; set; }
        public virtual ICollection<CourseScheduleAttendance> CourseScheduleAttendances { get; set; }
        public virtual ICollection<CourseScheduleMember> CourseScheduleMembers { get; set; }
        public virtual ICollection<OnGoingClassForUser> OnGoingClassForUsers { get; set; }
    }
}
