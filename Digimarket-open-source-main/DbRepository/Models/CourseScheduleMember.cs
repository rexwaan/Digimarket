using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseScheduleMember
    {
        public int CourseScheduleMembersId { get; set; }
        public int CourseScheduleCourseDetails { get; set; }
        public int UserId { get; set; }
        public int MemberType { get; set; }

        public virtual CourseScheduleCourseDetail CourseScheduleCourseDetailsNavigation { get; set; }
        public virtual User User { get; set; }
    }
}
