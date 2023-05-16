using DataTransferObject;
using DbRepository.Modules;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Thirdparty.AWS;
using Thirdparty.Mail;
using static System.Net.Mime.MediaTypeNames;

namespace DigiMarketWebApi.Controllers
{

	public class AWSController : BaseController
	{
		private readonly IAWSService awsService;

		public AWSController(IAWSService awsService, IMailRepo _mailRepo, UserOrganizationEmailActions userOrganizationEmailActions) : base(_mailRepo, userOrganizationEmailActions)
		{
			this.awsService = awsService;
		}
		[HttpPost]
		[Route("UploadFileToAWS")]
		public async Task<dynamic> UploadFileToAWSAsync([FromForm] UploadFileDTO fileObj)
		{
			bool res = false;
			if (!string.IsNullOrEmpty(fileObj.fileName) && fileObj.file.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					fileObj.file.CopyTo(memoryStream);
					res = await awsService.sendMyFileToS3Async(memoryStream, fileObj.fileName);
				}
			}
			return StatusCodes(res ? HttpStatusCode.OK : HttpStatusCode.BadRequest, res, $"{(res ? "Uploaded successfully!" : "Failed to upload!")}");

		}
		[HttpGet]
		[Route("GetSignedUrl")]
		public dynamic GetSignedUrl(string key)
		{
			string url = awsService.GetPreSignedURL(key);
			return StatusCodes(string.IsNullOrEmpty(url) ? HttpStatusCode.BadRequest: HttpStatusCode.OK, url, "");
		}
	}
}
