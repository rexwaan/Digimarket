using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class OnGoingClassForUser
    {
        public int OnGoingClassForUserId { get; set; }
        public int CourseScheduleCourseDetailsId { get; set; }
        public int UserId { get; set; }

        public virtual CourseScheduleCourseDetail CourseScheduleCourseDetails { get; set; }
        public virtual User User { get; set; }
    }
}
