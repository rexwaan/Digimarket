using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseScheduleParticipant
    {
        public int CourseScheduleParticipantsId { get; set; }
        public int CourseScheduleId { get; set; }
        public int UserId { get; set; }

        public virtual CourseSchedule CourseSchedule { get; set; }
        public virtual User User { get; set; }
    }
}
