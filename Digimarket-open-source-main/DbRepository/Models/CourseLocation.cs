using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseLocation
    {
        public CourseLocation()
        {
            CourseScheduleCourseDetails = new HashSet<CourseScheduleCourseDetail>();
        }

        public int CourseLocationId { get; set; }
        public string Location { get; set; }
        public string Details { get; set; }
        public int OrganizationId { get; set; }
        public string CreatedDate { get; set; }
        public int CreatedBy { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual ICollection<CourseScheduleCourseDetail> CourseScheduleCourseDetails { get; set; }
    }
}
