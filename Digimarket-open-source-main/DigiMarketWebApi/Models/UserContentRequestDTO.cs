namespace DigiMarketWebApi.Models
{
	public class UserContentRequestDTO
	{
		public int? requestedBy { get; set; }
		public int contentId { get; set; }
		public string name { get; set; }
		public string email { get; set; }
		public int? organizationId { get; set; }
	}
}
