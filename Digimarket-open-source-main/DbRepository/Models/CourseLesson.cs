using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseLesson
    {
        public int CourseLessonId { get; set; }
        public int CourseId { get; set; }
        public int UserContentId { get; set; }

        public virtual Course Course { get; set; }
        public virtual UserContent UserContent { get; set; }
    }
}
