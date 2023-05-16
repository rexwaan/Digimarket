namespace DigiMarketWebApi.Models
{
	public class AttendanceDTO
	{
		public int CourseScheduleAttendanceId { get; set; }
		public int CourseScheduleCourseDetailsId { get; set; }
		public int UserId { get; set; }
		public bool? IsPresent { get; set; }
		public int MarkedBy { get; set; }
	}
}
