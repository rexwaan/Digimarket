namespace DigiMarketWebApi.Models
{
    public class OrganizationRequestDTO: AddOrganizationRequestDTO
    {
        public int organizationRequestId { get; set; }
        public bool? organizationIsApproved { get; set; }
        public bool? organizationIsRejected { get; set; }
        public int userId { get; set; }
        public int? organizationId { get; set; }
        public int? organizationApprovedBy { get; set; }
        public int? organizationRejectedBy { get; set; }
        public string reason { get; set; }

    }
    public class AddOrganizationRequestDTO
    {
        public string emailAddress { get; set; }
        public string organizationName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
       

    }
    public class EditOrganizationRequestDTO
    {
        public int organizationId { get; set; }
        public string organizationName { get; set; }
        public string about { get; set; }
        public string country { get; set; }
        public string address { get; set; }
        public string contact { get; set; }
        public string logo { get; set; }
        public int organizationType { get; set; }

    }
}
