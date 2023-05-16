using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;

namespace DigiMarketWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {

        private readonly IMailRepo mailRepo;
        public MailController(IMailRepo mailRepo)
        {
            this.mailRepo = mailRepo;
        }
        [HttpPost("sendemail")]
        public async Task<IActionResult> SendMail(MailRequest mailRequest)
        {
            try
            {
                await mailRepo.SendEmailAsync(mailRequest);
                return Ok();
            }
            catch (Exception)
            {
                throw;
            }

        }
        [HttpPost("sendCustomEmail")]
        public async Task<dynamic> sendCustomEmail(MailRequest mailRequest)
        {
            string newLineBody = "";
            newLineBody = mailRequest.Body;
            newLineBody = newLineBody.Replace("\n", "<br />");
            const string Welcome_Email_Stats_FORMAT_FILE_PATH = "wwwroot/MailHtml/CustomMailFormat.html";
            const string BODYPLACEHOLDER = "MESSAGEBODY";
            string body = "";
            using (StreamReader file = new StreamReader(Welcome_Email_Stats_FORMAT_FILE_PATH))
            {
                string ln;

                while ((ln = file.ReadLine()) != null)
                {
                    body += "\n" + ln;
                }
                file.Close();

            }
            body = body.Replace(BODYPLACEHOLDER, newLineBody);
            mailRequest.Body = body;
            try
            {
                await mailRepo.SendEmailAsync(mailRequest);
                return new
                {
                    statusCode = 200,
                    message = "Mail Sent Successfully !"
                };

            }
            catch (Exception ex)
            {
                return new
                {
                    statusCode = 400,
                    message = "Mail is not Sent !"
                };
                //throw;
            }

        }
    }
}
