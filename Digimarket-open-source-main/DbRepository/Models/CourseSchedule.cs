using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseSchedule
    {
        public CourseSchedule()
        {
            CourseScheduleCourseDetails = new HashSet<CourseScheduleCourseDetail>();
        }

        public int CourseScheduleId { get; set; }
        public int CourseId { get; set; }
        public int OrganizationId { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual Course Course { get; set; }
        public virtual User CreatedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual ICollection<CourseScheduleCourseDetail> CourseScheduleCourseDetails { get; set; }
    }
}
