using Core.Helper;
using DbRepository.Models;
using DbRepository.Modules;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;

namespace DigiMarketWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationRequestController : BaseController
    {
        private readonly OrganizationRequestActions organizationRequestActions;
        private readonly OrganizationActions organizationActions;
        private readonly UserOrganizationEmailActions userOrganizationEmailActions;

        //private readonly digimarket_devContext _context;
        private readonly IMailRepo mailRepo;
        private readonly Appsettings _appSettings;

        public OrganizationRequestController(OrganizationRequestActions organizationRequestActions, OrganizationActions organizationActions, IMailRepo _mailRepo, IOptions<Appsettings> appSettings, UserOrganizationEmailActions userOrganizationEmailActions) : base(_mailRepo, userOrganizationEmailActions)
        {
            this.organizationRequestActions = organizationRequestActions;
            this.organizationActions = organizationActions;
            mailRepo = _mailRepo;
            _appSettings = appSettings.Value;
            this.userOrganizationEmailActions = userOrganizationEmailActions;
        }
        [HttpPost]
        [Route("AddOrganizationRequest")]
        public async Task<dynamic> AddOrganizationRequestAsync(AddOrganizationRequestDTO organizationRequest)
        {
            bool? isRejected = false;
            var orgRequestsDbData = await organizationRequestActions.GetAll().Where(x => x.EmailAddress == organizationRequest.emailAddress || x.OrganizationName == organizationRequest.organizationName).FirstOrDefaultAsync();
            if (orgRequestsDbData != null)
                isRejected = (await organizationActions.Get(orgRequestsDbData.OrganizationId))?.IsRejected.ConvertToBool();
            if (orgRequestsDbData != null && isRejected != true)
            {
                return StatusCode(400, new
                {
                    statusCode = 400,
                    result = "",
                    message = "Organization Already Exists !"
                });
            }
            else
            {
                if (!string.IsNullOrEmpty(organizationRequest.emailAddress) && !string.IsNullOrEmpty(organizationRequest.organizationName)
                    && !string.IsNullOrEmpty(organizationRequest.firstName) && !string.IsNullOrEmpty(organizationRequest.lastName))
                {
                    OrganizationRequest organizationRequestObjt = new OrganizationRequest
                    {
                        EmailAddress = organizationRequest.emailAddress,
                        OrganizationName = organizationRequest.organizationName,
                        FirstName = organizationRequest.firstName,
                        LastName = organizationRequest.lastName,
                        CreatedDate = DateTime.UtcNow.ToString(),

                    };
                    await organizationRequestActions.AddAsync(organizationRequestObjt);

                    var emailType = EmailType.Organization_Registration_Request;

                    string link = _appSettings.Domain + "/authentication/user-create?orgId=";
                    string forgetLink = _appSettings.Domain + "/authentication/forget";
                    string orgName = organizationRequest.organizationName;
                    // Key Value Pair to replace in the body
                    List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>("[firstName]", organizationRequest.firstName),
                        new KeyValuePair<string, string>("[lastName]", organizationRequest.lastName),
                        new KeyValuePair<string, string>("[orgName]", orgName),
                        new KeyValuePair<string, string>("[activationLink]", $"{_appSettings.Domain}/authentication/user-create?orgId={organizationRequestObjt.OrganizationRequestId}" ),
                        new KeyValuePair<string, string>("[loginLink]", _appSettings.Login),
                        new KeyValuePair<string, string>("[listOrganizationLink]", $"{_appSettings.Domain}/dashboard"),
                        new KeyValuePair<string, string>("[forgetPasswordLink]", $"{_appSettings.Domain}/authentication/forget"),
                        new KeyValuePair<string, string>("[contactUs]", _appSettings.Domain)
                    };
                    try
                    {
                        await mailRepo.SendEmail(organizationRequest.emailAddress, emailType, replacementDict);
                        return StatusCode(200, new
                        {
                            statusCode = 200,
                            message = "Successfully Added !"
                        });
                    }
                    catch (Exception)
                    {
                        throw;
                    }

                }
                else
                {
                    return StatusCode(400, new
                    {
                        statusCode = 400,
                        message = "Error Occured While Adding Request !"
                    });
                }
            }

        }
        [HttpPost]
        [Route("EditOrganizationRequest")]
        public async Task<dynamic> EditOrganizationRequestAsync(EditOrganizationRequestDTO editOrganizationRequest)
        {
            var organization = await organizationActions.Get(editOrganizationRequest.organizationId);
            if (organization == null)
            {
                return StatusCodes(HttpStatusCode.NotFound, string.Empty, "No Organization Found!");
            }
            else
            {
                var orgEditRequestList = await organizationRequestActions.GetAll().FirstOrDefaultAsync(x => x.OrganizationId == editOrganizationRequest.organizationId && x.IsEditRequest == 1 && (x.OrganizationIsRejected != 1 && x.OrganizationIsApproved != 1));
                if (orgEditRequestList != null)
                {
                    return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Edit Request is Pending!");

                }
                OrganizationRequest organizationRequestObjt = new OrganizationRequest
                {
                    OrganizationName = editOrganizationRequest.organizationName ?? string.Empty,
                    About = editOrganizationRequest.about ?? string.Empty,
                    ContactNumber = editOrganizationRequest.contact ?? string.Empty,
                    Country = editOrganizationRequest.country ?? string.Empty,
                    Address = editOrganizationRequest.address ?? string.Empty,
                    Logo = editOrganizationRequest.logo ?? string.Empty,
                    OrganizationId = editOrganizationRequest.organizationId,
                    OrganizationType = editOrganizationRequest.organizationType,
                    IsEditRequest = 1,
                    CreatedDate = DateTime.UtcNow.ToString(),
                };
                await organizationRequestActions.AddAsync(organizationRequestObjt);
                
                return StatusCodes(HttpStatusCode.OK, string.Empty, "Edit Request Added for Approval!");
            }
        }
        [HttpPatch]
        [Route("ApproveRejectOrganizationEditRequest")]
        public async Task<dynamic> ApproveRejectOrganizationEditRequestAsync(int organizationRequestId, bool isApproved, int userId)
        {
            var organizationRequest = await organizationRequestActions.GetAll().FirstOrDefaultAsync(x => x.OrganizationRequestId == organizationRequestId);
            if (organizationRequest == null)
            {
                return StatusCodes(HttpStatusCode.NotFound, string.Empty, "No Organization Edit Request Found!");
            }
            var organization = await organizationActions.Get(organizationRequest.OrganizationId);
            if (organization == null)
            {
                return StatusCodes(HttpStatusCode.NotFound, string.Empty, "No Organization Found!");
            }
            if (isApproved)
            {
                if (!string.IsNullOrEmpty(organizationRequest.OrganizationName))
                    organization.Name = organizationRequest.OrganizationName;
                if (!string.IsNullOrEmpty(organizationRequest.Address))
                    organization.Address = organizationRequest.Address;
                if (!string.IsNullOrEmpty(organizationRequest.Country))
                    organization.Country = organizationRequest.Country;
                if (!string.IsNullOrEmpty(organizationRequest.ContactNumber))
                    organization.ContactNumber = organizationRequest.ContactNumber;
                if (!string.IsNullOrEmpty(organizationRequest.Logo))
                    organization.Logo = organizationRequest.Logo;
                if (organizationRequest.OrganizationType != 0)
                    organization.TypeOfOrganization = organizationRequest.OrganizationType;

                if (!string.IsNullOrEmpty(organizationRequest.About))
                    organization.AboutOrganziation = organizationRequest.About;
                organization.UpdatedDate = DateTime.UtcNow.ToString();
                await organizationActions.UpdateAsync(organization);
                
                organizationRequest.OrganizationIsApproved = 1;
                organizationRequest.OrganizationApprovedBy = userId;
            }
            else
            {
                organizationRequest.OrganizationIsRejected = 1;
                organizationRequest.OrganizationRejectedBy = userId;
            }
            await organizationRequestActions.UpdateAsync(organizationRequest);
            return StatusCodes(HttpStatusCode.OK, string.Empty, "Organization Edit Request " + (isApproved ? "Approved!" : "Rejected"));


        }
        [HttpGet]
        [Route("GetOrgEmail")]
        public async Task<dynamic> GetOrganizationRequestEmailAsync(int orgId)
        {
            var orgRequestObj = await organizationRequestActions.Get(orgId);
            if (orgRequestObj.OrganizationId != null)
            {
                return StatusCode(400, new
                {
                    statusCode = 400,
                    result = "",
                    message = "Organization Already Exists !"
                });
            }
            else
            {
                return StatusCode(200, new
                {
                    statusCode = 200,
                    result = orgRequestObj,
                    message = ""
                });
            }
        }

    }
}
