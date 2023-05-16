using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataTransferObject
{
	public class UploadFileDTO
	{
		public string fileName { get; set; }
		public IFormFile file { get; set; }
	}
}
