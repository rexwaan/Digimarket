using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Thirdparty.AWS
{
	public interface IAWSService
	{
		string GetPreSignedURL(string key);
		Task<bool> sendMyFileToS3Async(Stream fileStream, string fileNameInS3);
	}
}
