using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace Thirdparty.Mail
{
    public interface IMailRepo
    {
        Task SendEmail(string emailTo, EmailType emailType, List<KeyValuePair<string, string>> replacementDict);
        Task SendEmailAsync(MailRequest mailRequest);
    }
}
