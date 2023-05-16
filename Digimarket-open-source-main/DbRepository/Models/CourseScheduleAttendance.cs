using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseScheduleAttendance
    {
        public int CourseScheduleAttendanceId { get; set; }
        public int CourseScheduleCourseDetailsId { get; set; }
        public int UserId { get; set; }
        public ulong? IsPresent { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual CourseScheduleCourseDetail CourseScheduleCourseDetails { get; set; }
        public virtual User CreatedByNavigation { get; set; }
        public virtual User User { get; set; }
    }
}
