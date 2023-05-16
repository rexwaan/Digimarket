using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace Thirdparty.Mail
{
    public class MailRepo : IMailRepo
    {
        private readonly MailSettings _mailSettings;

        public MailRepo(IOptions<Appsettings> appSettings)
        {
            _mailSettings = appSettings.Value.MailSettings;
        }
        /// <summary>
        /// Sends Email
        /// </summary>
        /// <param name="mailRequest">Mail Request Object</param>
        /// <returns></returns>
        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var email = new MailMessage();
            email.From = new MailAddress(_mailSettings.Mail, _mailSettings.DisplayName);
            email.To.Add(new MailAddress(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;
            email.Body = mailRequest.Body;
            email.IsBodyHtml = true;
            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Host = _mailSettings.Host;
                smtpClient.Port = _mailSettings.Port;
                smtpClient.EnableSsl = true;
                smtpClient.Credentials = new NetworkCredential(_mailSettings.Username, _mailSettings.Password);
                smtpClient.Send(email);
            }
        }
        /// <summary>
        /// this method will convert the template in string and replace the keys based on replacementDict
        /// </summary>
        /// <param name="address">email template name</param>
        /// <param name="replacementDict">List of key value pairs to replace in the email template body</param>
        /// <returns>email template</returns>
        private string createEmailBody(string address, List<KeyValuePair<string, string>> replacementDict)
        {
            string body = string.Empty;
            if (address.StartsWith("~/"))
                address = address.Replace("~/", "");
            using (StreamReader reader = new StreamReader($"wwwroot/MailHtml/{address}.html"))
            {
                body = reader.ReadToEnd();
            }
            return body.ReplaceKeyWithValue(replacementDict);
        }
        /// <summary>
        /// This method will get the subject and template based on emailType enum, replace them with given replacementDict and send the email to the given email address 
        /// </summary>
        /// <param name="emailTo">Email of the recevier</param>
        /// <param name="emailType">Type of Email</param>
        /// <param name="replacementDict">List of key value pairs to replace in the email template body</param>
        /// <returns></returns>
        public async Task SendEmail(string emailTo,EmailType emailType, List<KeyValuePair<string, string>> replacementDict)
        {
            MailRequest mailRequest = new MailRequest
            {
                ToEmail = emailTo,
                Subject = emailType.GetDescription().ReplaceKeyWithValue(replacementDict)
            };
            mailRequest.Body = createEmailBody(emailType.ToString(), replacementDict);
            await SendEmailAsync(mailRequest);
        }
    }
}
