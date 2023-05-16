using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class CourseScheduleAddTeam
    {
        public int CourseScheduleAddTeamId { get; set; }
        public int CourseScheduleId { get; set; }
        public int UserId { get; set; }

        public virtual CourseSchedule CourseSchedule { get; set; }
        public virtual User User { get; set; }
    }
}
