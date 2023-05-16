using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace Thirdparty.AWS
{
	public class AWSService : IAWSService
	{
		private readonly AWSConfig _awsConfig;

		public AWSService(IOptions<Appsettings> appSettings)
		{
			_awsConfig = appSettings.Value.AWSConfig;
		}
		public async Task<bool> sendMyFileToS3Async(Stream fileStream, string fileNameInS3)
		{
			try
			{
				IAmazonS3 client = new AmazonS3Client(_awsConfig.accessKeyId, _awsConfig.secretAccessKey, GetRegion(_awsConfig.region));
				TransferUtility utility = new TransferUtility(client);
				TransferUtilityUploadRequest request = new TransferUtilityUploadRequest();

				if (string.IsNullOrEmpty(_awsConfig.subDirectoryInBucket))
				{
					request.BucketName = _awsConfig.bucketName; //no subdirectory just bucket name  
				}
				else
				{   // subdirectory and bucket name  
					request.BucketName = $"{_awsConfig.bucketName}/{_awsConfig.subDirectoryInBucket}";
				}
				request.Key = fileNameInS3; //file name up in S3  
				request.InputStream = fileStream;
				await utility.UploadAsync(request); //commensing the transfer  

				return true; //indicate that the file was sent  
			}
			catch (Exception ex)
			{

				return false;
			}

		}
		private RegionEndpoint GetRegion(string region)
		{
			return RegionEndpoint.GetBySystemName(region);
		}
		private async Task GetFilesListAsync()
		{
			IAmazonS3 client = new AmazonS3Client(_awsConfig.accessKeyId, _awsConfig.secretAccessKey, GetRegion(_awsConfig.region));

			ListObjectsRequest requests = new ListObjectsRequest()
			{
				BucketName = _awsConfig.bucketName
			};
			ListObjectsResponse response = await client.ListObjectsAsync(requests).ConfigureAwait(false);

		}

		public string GetPreSignedURL(string key)
		{
			IAmazonS3 client = new AmazonS3Client(_awsConfig.accessKeyId, _awsConfig.secretAccessKey, GetRegion(_awsConfig.region));

			GetPreSignedUrlRequest requests = new GetPreSignedUrlRequest()
			{
				BucketName = _awsConfig.bucketName,
				Key = key,
				Verb = HttpVerb.GET,
				Expires = DateTime.Now.AddMinutes(_awsConfig.expiresInMins),
			};
			var response = client.GetPreSignedURL(requests);
			return response.ToString();

		}
	}
}
