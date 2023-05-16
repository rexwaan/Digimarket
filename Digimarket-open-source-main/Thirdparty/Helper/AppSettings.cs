using System;
using System.Collections.Generic;
using System.Text;

namespace Thirdparty.Helper
{
    public class MailSettings
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
    }
    public class AWSConfig
    {
        public string accessKeyId { get; set; }
        public string secretAccessKey { get; set; }
        public string bucketName { get; set; }
        public string subDirectoryInBucket { get; set; }
        public string region { get; set; }
        public int expiresInMins { get; set; }
    }

	public class Appsettings
    {
        public string Domain { get; set; }
        public string Login { get; set; }
        public MailSettings MailSettings { get; set; }
        public AWSConfig AWSConfig { get; set; }
    }
}
