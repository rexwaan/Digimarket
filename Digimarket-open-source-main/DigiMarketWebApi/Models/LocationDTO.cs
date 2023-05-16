namespace DigiMarketWebApi.Models
{
    public class LocationDTO
    {
        public int courseLocationId { get; set; }
        public string location { get; set; }
        public string details { get; set; }
        public int organizationId { get; set; }
        public int createdBy { get; set; }        
    }
}
