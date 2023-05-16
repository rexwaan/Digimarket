using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Course
    {
        public Course()
        {
            CourseLessons = new HashSet<CourseLesson>();
            CourseSchedules = new HashSet<CourseSchedule>();
        }

        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public int OrganizationId { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual ICollection<CourseLesson> CourseLessons { get; set; }
        public virtual ICollection<CourseSchedule> CourseSchedules { get; set; }
    }
}
