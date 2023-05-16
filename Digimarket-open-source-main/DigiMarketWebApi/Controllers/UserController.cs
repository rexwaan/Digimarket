using Core.Helper;
using DbRepository.Models;
using DigiMarketWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Microsoft.Extensions.Options;
using DbRepository.Modules;
using Microsoft.AspNetCore.Routing;
using DataTransferObject;

namespace DigiMarketWebApi.Controllers
{

    public class UserController : BaseController
    {

        private readonly UserActions userActions;
        private readonly OrganizationActions organizationActions;
        private readonly UserOrganizationActions userOrganizationActions;
        private readonly UserOrganizationRoleActions userOrganizationRoleActions;
        private readonly RolePermissionActions rolePermissionActions;
        private readonly OrganizationRequestActions organizationRequestActions;
        private readonly RoleActions roleActions;
        private readonly PermissionActions permissionActions;
        private readonly UsernameLoginStudentActions usernameLoginStudentActions;
        private readonly UserOrganizationEmailActions userOrganizationEmailActions;
        private readonly UserContentSharingPermissionsActions userContentSharingPermissionsActions;

        private readonly IMailRepo mailRepo;
        private readonly Appsettings _appSettings;

        public UserController(UserActions userActions, OrganizationActions organizationActions, UserOrganizationActions userOrganizationActions, UserOrganizationRoleActions userOrganizationRoleActions,
            IMailRepo _mailRepo, IOptions<Appsettings> appSettings, RolePermissionActions rolePermissionActions, OrganizationRequestActions organizationRequestActions, RoleActions roleActions, PermissionActions permissionActions, UsernameLoginStudentActions usernameLoginStudentActions, UserOrganizationEmailActions userOrganizationEmailActions, UserContentSharingPermissionsActions userContentSharingPermissionsActions) : base(_mailRepo, userOrganizationEmailActions)
        {
            this.userActions = userActions;
            this.organizationActions = organizationActions;
            this.userOrganizationActions = userOrganizationActions;
            this.userOrganizationRoleActions = userOrganizationRoleActions;
            this.mailRepo = _mailRepo;
            _appSettings = appSettings.Value;
            this.rolePermissionActions = rolePermissionActions;
            this.organizationRequestActions = organizationRequestActions;
            this.roleActions = roleActions;
            this.permissionActions = permissionActions;
            this.usernameLoginStudentActions = usernameLoginStudentActions;
            this.userOrganizationEmailActions = userOrganizationEmailActions;
            this.userContentSharingPermissionsActions = userContentSharingPermissionsActions;
        }
        [HttpPost]
        [Route("SignInToAnotherOrganization")]
        public async Task<dynamic> SignInToAnotherOrganizationAsync(SignInAnotherOrgModel signInAnotherOrgModel)
        {
            var organization = await organizationActions.GetByEndPoint(signInAnotherOrgModel.organizationName);
            var existingUser = await userActions.GetUser(signInAnotherOrgModel.email, Encryption.Encode(signInAnotherOrgModel.password));
            if (existingUser != null && organization != null)
            {
                existingUser.IsRoot = null;
                existingUser.ParentId = signInAnotherOrgModel.rootuserid;
                await userActions.UpdateAsync(existingUser);
                var obj = await userOrganizationActions.GetUserOrganization(organization.OrganizationId, existingUser.UserId);
                if (obj != null)
                {
                    UserOrganization userOrganization = new UserOrganization();
                    userOrganization.UserId = signInAnotherOrgModel.rootuserid;
                    userOrganization.OrganizationId = organization.OrganizationId;
                    userOrganization.IsLinked = 1;
                    userOrganization.LinkedUserOrganizationId = obj.UserOrganizationId;

                    await userOrganizationActions.AddAsync(userOrganization);

                    // get current roles
                    var userRoles = await userOrganizationRoleActions.GetAll().Where(x => x.UserOrganizationId == obj.UserOrganizationId).Include(x => x.Role).Select(x => x.RoleId).ToListAsync();

                    // role 
                    // assign all the roles to this userOrganization
                    List<UserOrganizationRole> roles = new List<UserOrganizationRole>();
                    foreach (var role in userRoles)
                    {
                        roles.Add(new UserOrganizationRole()
                        {
                            RoleId = role,
                            UserOrganizationId = userOrganization.UserOrganizationId,
                            CreatedDate = DateTime.UtcNow.ToString(),
                            CreatedBy = userOrganization.UserId,
                        });
                    }
                    await userOrganizationRoleActions.AddRangeAsync(roles);


                    return StatusCode(200, new
                    {
                        statusCode = 200,
                        result = "",
                        message = "Sign In To Another Organization Successfull !",
                    });
                }
                else
                {
                    return StatusCode(404, new
                    {
                        statusCode = 404,
                        result = "",
                        message = "User Organization Doesn't Exist !",
                    });
                }

            }
            else
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = "",
                    message = "Email or Password is Incorrect !",
                });
            }

        }
        [HttpPost]
        [Route("UserLogin")]
        public async Task<dynamic> UserLoginAsync(UserLoginModel userLoginModel)
        {
            string pwdEncrypt = Encryption.Encode(userLoginModel.password);
            var emailExist = await userActions.GetByEmail(userLoginModel.email);
            if (emailExist == null)
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = "",
                    message = "User Not Found !",
                });
            }
            //var email = await userOrganizationEmailActions.GetAll().Where(x => x.Email == userLoginModel.email).FirstOrDefaultAsync();
            var userExist = await userActions.GetAll().Where(x => x.UserOrganizationEmails.Any(n=>n.Email == userLoginModel.email && n.UserId == x.UserId && n.IsVerified == 1) && x.Password == pwdEncrypt)
                .Include(x => x.UserOrganizationUsers).ThenInclude(x => x.UserOrganizationRoles)
                .FirstOrDefaultAsync();
            if (userExist == null)
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = string.Empty,
                    message = "Incorrect credentials!",
                });
            }
            List<UserPermssionsByOrganization> userDataList = new List<UserPermssionsByOrganization>();
            foreach (var userOrganization in userExist.UserOrganizationUsers.Where(x => x.IsActive != 0).ToList())
            {
                // get roles for each organization
                var roles = userOrganization.UserOrganizationRoles.Select(x => x.RoleId).ToList();
                // get permission againsat those role
                var permssions = await rolePermissionActions.GetPermissionsByRoles(roles);
                userDataList.Add(new UserPermssionsByOrganization()
                {
                    organizationId = userOrganization.OrganizationId,
                    permissions = permssions.Distinct().Select(x => new PermmsionsDetails()
                    {
                        permissionId = x.PermissionId,
                        permissionName = x.Name
                    }).ToList(),
                    role = await userOrganizationRoleActions.GetRolesByUser(userOrganization.UserOrganizationId)
                });
            }

            if (userExist != null)
            {
                return StatusCode(200, new
                {
                    statusCode = 200,
                    result = new UserLoginReturnModel()
                    {
                        userId = userExist.UserId,
                        firstName = userExist.Firstname,
                        lastName = userExist.Lastname,
                        //email = userOrganizationEmailActions.GetEmailByOrganization(userExist.UserId),
                        contactNumber = userExist.ContactNumber,
                        createdDate = userExist.CreatedDate,
                        dob = userExist.Dob,
                        isActive = userExist.IsActive.ConvertToBool(),
                        isPlatformAdmin = userExist.IsPlatformAdmin.ConvertToBool(),
                        isRoot = userExist.IsRoot.ConvertToBool(),
                        parentId = userExist.ParentId,
                        password = userExist.Password,
                        userOgranizations = userDataList ?? new List<UserPermssionsByOrganization>(),
                        image = userExist.Image
                    },
                    message = "Successful login !"
                }); ;
            }
            else
            {
                return StatusCode(400, new
                {
                    statusCode = 400,
                    result = "",
                    message = "User Not Found !",
                });
            }

        }

        [HttpPost]
        [Route("LogOut")]
        public dynamic UserLogOut()
        {
            return StatusCode(200, new
            {
                statusCode = 200,
                result = "",
                message = "Successful Logout !"
            });
        }
        [HttpPost]
        [Route("AddUser")]
        public async Task<dynamic> AddUserAsync(UserOrganizationModel userOrganizationModel)
        {
            if (await userOrganizationEmailActions.GetAll().AnyAsync(x=>x.Email == userOrganizationModel.Email))
            {
                return StatusCode(400, new
                {
                    statusCode = 400,
                    message = "Email already exists!",
                });
            }
            try
            {
                string result = Encryption.Encode(userOrganizationModel.Password);
                var currentDate = DateTime.UtcNow;
                User userObj = new User
                {
                    Firstname = userOrganizationModel.Firstname,
                    Lastname = userOrganizationModel.Lastname,
                    CreatedDate = currentDate.ToString(),
                    Password = result
                };
                userActions.Add(userObj);
                var userId = userObj.UserId;
                Organization organization = new Organization
                {
                    Name = userOrganizationModel.OrganizationName,
                    EndPoint = userOrganizationModel.EndPoint,
                    AboutOrganziation = userOrganizationModel.AboutOrganziation,
                    EmailAddress = userOrganizationModel.Email,
                    Logo = userOrganizationModel.Logo,
                    Address = userOrganizationModel.Address,
                    ContactNumber = userOrganizationModel.ContactNumber,
                    Country = userOrganizationModel.CountryCode,
                    TypeOfOrganization = 1,
                    Creator = userId,
                    CreatedDate = DateTime.UtcNow.ToString(),
                    OrganizationId = userOrganizationModel.OrganizationRequestId


                };
                
                await organizationActions.AddAsync(organization);

                // add email against organization
                UserOrganizationEmail emailObj = new UserOrganizationEmail()
                {
                    UserId = userId,
                    Email = userOrganizationModel.Email,
                    OrganizationId = organization.OrganizationId,
                    IsVerified = 1,
                    IsNotificationOn = 1,
                    IsPrimary = 1
                };
                await userOrganizationEmailActions.AddAsync(emailObj);

                OrganizationRequest organizationRequest = new OrganizationRequest();
                organizationRequest = await organizationRequestActions.Get(userOrganizationModel.OrganizationRequestId);
                organizationRequest.OrganizationId = organization.OrganizationId;
                await organizationRequestActions.UpdateAsync(organizationRequest);
                UserOrganization userOrganization = new UserOrganization
                {
                    UserId = userId,
                    OrganizationId = organization.OrganizationId
                };
                await userOrganizationActions.AddAsync(userOrganization);

                // create role for the organization 
                int roleId = 0;
                foreach (var roleType in roleActions.GetAllRoles())
                {
                    Role role = new Role()
                    {
                        Name = roleType.ToString(),
                        DisplayName = roleType.GetRoleDisplayName(),
                        Details = roleType.GetDescription(),
                        IsMandatory = 1,
                        OrganizationId = organization.OrganizationId,
                        CreatedBy = userId,
                        CreatedDate = DateTime.UtcNow.ToString(),
                    };
                    await roleActions.AddAsync(role);

                    if (roleType == RoleType.Owner)
                    {
                        roleId = role.RoleId;
                    }
                    await rolePermissionActions.AssignPermissionsToRole(role.RoleId, roleType, userId);

                }
                // assign role and permssions
                UserOrganizationRole userOrganizaionRole = new UserOrganizationRole()
                {
                    RoleId = roleId,
                    UserOrganizationId = userOrganization.UserOrganizationId,
                    CreatedDate = DateTime.UtcNow.ToString(),
                    CreatedBy = userId,
                };
                await userOrganizationRoleActions.AddAsync(userOrganizaionRole);

                // email
                // Key Value Pair to replace in the body
                List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("[firstName]", userOrganizationModel.Firstname),
                    new KeyValuePair<string, string>("[lastName]", userOrganizationModel.Lastname),
                    new KeyValuePair<string, string>("[orgName]", userOrganizationModel.OrganizationName)
                };

                try
                {
                    await mailRepo.SendEmail(userOrganizationModel.Email, EmailType.Organization_Registration_Update, replacementDict);
                    return StatusCode(200, new
                    {
                        statusCode = 200,
                        message = "Email Sent!"
                    });
                }
                catch (Exception)
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    statusCode = 500,
                    result = ex,
                    message = "Operation is Not Successfull !"
                });
                //throw;
            }

        }
        [HttpPost]
        [Route("ResetPassword")]
        public async Task<dynamic> ResetPasswordAsync(ResetPasswordDTO resetPasswordDTO)
        {
            var user = await userActions.Get(resetPasswordDTO.userId);
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "User not Exist!");
            }
            user.Password = Encryption.Encode(resetPasswordDTO.password);
            userActions.Update(user);
            // email
            if (resetPasswordDTO.isAdmin)
            {
				string link = _appSettings.Domain + $"/dashboard/add-students-parent";
				var usernameLogin = await usernameLoginStudentActions.GetByUserId(resetPasswordDTO.userId);
                sendApprovedEmail(usernameLogin, resetPasswordDTO.password, (int)resetPasswordDTO.organizationId, link);
            }
            return StatusCodes(HttpStatusCode.OK, string.Empty, "Password Reset!");

        }
        [HttpPost]
        [Route("CheckOldPassword")]
        public async Task<dynamic> CheckOldPasswordAsync(UpdateUserDTO userInfo)
        {
            //string password = RandomPasswordGenerator.GeneratePassword();
            var user = await userActions.Get(userInfo.userId);
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "User not Exist!");
            }
            if (user.Password == Encryption.Encode(userInfo.password))
            {
                return StatusCodes(HttpStatusCode.OK, string.Empty, "Password Matched!");
            }
            return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Password Not Matched!");

        }

        [HttpPost]
        [Route("UpdateUserInfo")]
        public async Task<dynamic> UpdateUserInfoAsync(UpdateUserDTO userInfo)
        {
            var user = await userActions.Get(userInfo.userId);
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "User not Exist!");
            }
            if (!string.IsNullOrEmpty(userInfo.password))
            {
                user.Password = Encryption.Encode(userInfo.password);
            }
            user.Firstname = userInfo.firstName;
            user.Lastname = userInfo.lastName;
            user.Dob = userInfo.dob;
            user.Image = userInfo.image;

            userActions.Update(user);

            return StatusCodes(HttpStatusCode.OK, string.Empty, "User Info Updated!");

        }

        [HttpPost]
        [Route("ForgetPassword")]
        public async Task<dynamic> ForgetPasswordAsync(string email)
        {
            var user = await userActions.GetByEmail(email);
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "User not Exist!");
            }
            var link = $"{_appSettings.Domain}/authentication/resetpass?userId={user.UserId}";
            ForgerPassword(user, email, link);
            return StatusCodes(HttpStatusCode.OK, string.Empty, "Forget Password Email Sent!");

        }

        [HttpGet]
        [Route("GetLeadTeachers")]
        public async Task<dynamic> GetLeadTeachers(int organizationId,int lessonId)
        {
            List<UserDTO> usersData = new List<UserDTO>();
            var permission = await permissionActions.GetPermissionByName(Permissions.deliver_class_as_a_teacher.GetDescription());
            if (permission == null)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Permission not found");
            }
            var users = (await userOrganizationActions.GetUsersByPermission(organizationId, permission.PermissionId)).ToList();
            foreach (var user in users)
            {
                List<UserRolesWithOrganizationDTO> userRoles = await userActions.GetUserRolesInAllOrganizations(user.UserId);
                var contentSharingPetrmissions = await userContentSharingPermissionsActions.GetAll().Where(x => x.PermissionsUserContentId == lessonId).Include(x=>x.PermissionsUserContent).ThenInclude(x=>x.SpecificUserPrmissions).FirstOrDefaultAsync();
                bool hasAccess = HasAccessToLesson(contentSharingPetrmissions, lessonId,string.Empty, user.UserId, organizationId, userRoles);
                if (hasAccess)
                {
                    usersData.Add(new UserDTO()
                    {
                        userId = user.UserId,
                        firstname = user.Firstname,
                        lastname = user.Lastname,
                        email = userOrganizationEmailActions.GetPrimaryEmailByOrganization(user.UserId, organizationId).Result,
                        contact = user.ContactNumber,
                        dob = user.Dob,
                        image = user.Image,
                    });
                }
            }            
            return StatusCodes(HttpStatusCode.OK, usersData, $"{usersData.Count} Lead Teacher Found!");

        }
        [HttpGet]
        [Route("GetAdditonalParticipants")]
        public async Task<dynamic> GetAdditonalParticipents(int organizationId)
        {
            var permission = await permissionActions.GetPermissionByName(Permissions.Lesson_schedule_view_additional_participants.GetDescription());
            if (permission == null)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Permission not found");
            }
            var resp = (await userOrganizationActions.GetAddionalParticipantForSchedule(organizationId, permission.PermissionId)).Select(x => new UserDTO
            {
                userId = x.UserId,
                firstname = x.Firstname,
                lastname = x.Lastname,
                email = userOrganizationEmailActions.GetPrimaryEmailByOrganization(x.UserId, organizationId).Result,
                contact = x.ContactNumber,
                dob = x.Dob,
                image = x.Image,
            }).ToList();
            return StatusCodes(HttpStatusCode.OK, resp, $"{resp.Count} Additional Participant Found!");

        }
        [HttpGet]
        [Route("GetParticipents")]
        public async Task<dynamic> GetParticipents(int organizationId)
        {
            var permission = await permissionActions.GetPermissionByName(Permissions.Lesson_schedule_view_student.GetDescription());
            if (permission == null)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Permission not found");
            }
            var resp = (await userOrganizationActions.GetStudentsForSchedule(organizationId, permission.PermissionId)).Select(x => new UserDTO
            {
                userId = x.UserId,
                firstname = x.Firstname,
                lastname = x.Lastname,
                email = userOrganizationEmailActions.GetPrimaryEmailByOrganization(x.UserId, organizationId).Result,
                contact = x.ContactNumber,
                dob = x.Dob,
                image = x.Image,
            }).ToList();
            return StatusCodes(HttpStatusCode.OK, resp, $"{resp.Count} Participants Found!");

        }
        [HttpPost]
        [Route("VerifyOrganiationDetails")]
        public async Task<dynamic> VerifyOrganiationDetails(OrganizationDetailDTO orgInfo)
        {
            //string password = RandomPasswordGenerator.GeneratePassword();
            var user = await userActions.GetAll().Where(x => x.UserOrganizationEmails.Any(n => n.Email == orgInfo.email && n.OrganizationId == orgInfo.organizationId)).FirstOrDefaultAsync();
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadGateway, string.Empty, "User not Exist!");
            }
            if (user.Password == Encryption.Encode(orgInfo.password))
            {
                return StatusCodes(HttpStatusCode.OK, string.Empty, "Password Matched!");
            }
            return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Password Not Matched!");
        }
        [HttpPost]
        [Route("ChangeUserActiveStatus")]
        public async Task<dynamic> ChangeUserActiveStatus(UpdateUserStatus updateUserStatus)
        {
            var user = await userActions.Get(updateUserStatus.userId);
            var organization = await organizationActions.Get(updateUserStatus.organizationId);
            if (user == null)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "User not Found!");
            }
            var msg = updateUserStatus.active == true ? "Activated" : "Deactivated";
            // change status of parent
            var resp = await userOrganizationActions.ChangeUserActiveStatus(new List<int>() { user.UserId }, updateUserStatus.organizationId, updateUserStatus.active);

            // change status of students in the same organization
            var allKids = await usernameLoginStudentActions.GetKidsByParentId(user.UserId);
            if (allKids != null && allKids.Count > 0)
            {
                // get userOrganizations for kids
                await userOrganizationActions.ChangeUserActiveStatus(allKids, updateUserStatus.organizationId, updateUserStatus.active);

            }
            var emails = await userOrganizationEmailActions.GetEmailsByOrganizationForNotifications(new List<int> { user.UserId }, updateUserStatus.organizationId);
            var student = await usernameLoginStudentActions.GetAll().Where(x => x.UserId == user.UserId).Include(x => x.LinkParent).FirstOrDefaultAsync();
            if (student != null)
            {
                emails = await userOrganizationEmailActions.GetEmailsByOrganizationForNotifications(new List<int> { student.LinkParent.UserId }, updateUserStatus.organizationId);
            }
            if (resp)
            {
                string otherOrganizations = string.Empty;
                var orgList = userOrganizationActions.GetAll().Where(x => x.UserId == updateUserStatus.userId && x.OrganizationId!= updateUserStatus.organizationId)
                    .Include(x => x.Organization)
                    .Select(x => x.Organization.Name).ToList();
                if (orgList.Count > 0)
                {
                    otherOrganizations = @"<hr/><div>
										Your access to the other organizations you are a member in has not been changed:
										[orgList]
										</div><hr/><br/>";
                    var orgs = "<ul>";
                    foreach (var org in orgList)
                    {
                        orgs += $"<li> {org} </li>";
                    }
                    orgs += "</ul>";
                    otherOrganizations = otherOrganizations.Replace("[orgList]", orgs);
                }
				string link = _appSettings.Domain + $"/dashboard?orgId={organization.OrganizationId}";

				List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
                        {
                            new KeyValuePair<string, string>("[firstName]", user.Firstname),
                            new KeyValuePair<string, string>("[lastName]", user.Lastname),
                            new KeyValuePair<string, string>("[orgName]", organization.Name),
                            new KeyValuePair<string, string>("[orgList]", otherOrganizations),
                            new KeyValuePair<string, string>("[contactUsPage]", link)
                        };
                try
                {
                    foreach (var email in emails.Select(x=>x.email).ToList())
                    {
                        await mailRepo.SendEmail(email, updateUserStatus.active ? EmailType.Reactivate_User : EmailType.Deactivate_User, replacementDict);
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return StatusCodes(HttpStatusCode.OK, string.Empty, resp ? $"{msg} successfully" : "Failed");
        }
        [HttpGet]
        [Route("GetEmailsByOrganization")]
        public async Task<dynamic> GetEmailsByOrganization(int userId, int organizationId)
        {
            var res = await userOrganizationEmailActions.GetAll().Where(x => x.OrganizationId == organizationId && x.UserId == userId && x.IsVerified == 1).Select(x => new emailDTO { email = x.Email, emailId = x.UserOrganizationEmailId, isNotificationOn = x.IsNotificationOn == 1, isPrimary = x.IsPrimary == 1, isVerified = x.IsVerified == 1 }).ToListAsync();
            return StatusCodes(HttpStatusCode.OK, res, "Emails Found!");
        }
        [HttpPost]
        [Route("AddEmailForOrganization")]
        public async Task<dynamic> AddEmailForOrganization(AddEmail addEmail)
        {
            Random rnd = new Random();
            int pin = rnd.Next(100000, 999999);
            var user = await userActions.Get(addEmail.userId);

            var isEmailExistForOtherUser = await userOrganizationEmailActions.GetAll().AnyAsync(x => x.Email == addEmail.email && x.UserId != addEmail.userId);
            if (isEmailExistForOtherUser)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "This Email ID is linked to organization in another account. If you want to access organizations of this Email ID, Click \"Sign into Another Org\" from side panel.");

            }
            var isEmailExistInSameOrganization = await userOrganizationEmailActions.GetAll().AnyAsync(x => x.Email == addEmail.email && x.UserId == addEmail.userId && x.OrganizationId == addEmail.organizationId);
            if (isEmailExistInSameOrganization)
            {
                return StatusCodes(HttpStatusCode.BadRequest, string.Empty, "Email already exist is this organization!");

            }
            UserOrganizationEmail obj = new UserOrganizationEmail()
            {
                Email = addEmail.email,
                OrganizationId = addEmail.organizationId,
                UserId = addEmail.userId,
                Pin = pin,
                PinGeneratedAt = DateTime.UtcNow.ToString(),

            };
            await userOrganizationEmailActions.AddAsync(obj);

            List<KeyValuePair<string, string>> replacementDict = new List<KeyValuePair<string, string>>
                        {
                            new KeyValuePair<string, string>("[firstName]", user.Firstname),
                            new KeyValuePair<string, string>("[lastName]", user.Lastname),
                            new KeyValuePair<string, string>("[pin]", pin.ToString()),
                        };
            try
            {
                await mailRepo.SendEmail(addEmail.email, EmailType.Add_New_Email, replacementDict);
            }
            catch (Exception)
            {
                throw;
            }
            return StatusCodes(HttpStatusCode.OK, string.Empty, "Email Sent!");
        }
        [HttpPost]
        [Route("VerifyEmailByPin")]
        public async Task<dynamic> VerifyEmailByPin(VerifyEmail verifyEmail)
        {
            var res = await userOrganizationEmailActions.CheckPinAndVerifyEmail(verifyEmail.email, verifyEmail.userId, verifyEmail.organizationId, verifyEmail.pin);
            return StatusCodes(HttpStatusCode.OK, string.Empty, res ? "Email Verified!" : "Incorrect Pin!");
        }
        [HttpPost]
        [Route("TurnNotificationOnOff")]
        public async Task<dynamic> TurnNotificationOnOff(UpdateEmail obj)
        {
            var (isSuccess, response) = await userOrganizationEmailActions.TurnOnOffNotificationn(obj.emailId, obj.isNotificationsOn);
            return StatusCodes(isSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, isSuccess ? "Notification Updated!" : response);
        }
        [HttpDelete]
        [Route("RemoveEmailId")]
        public async Task<dynamic> RemoveEmailId(int userOrganizationEmailId)
        {
            var (isSuccess, response) = await userOrganizationEmailActions.RemoveEmail(userOrganizationEmailId);
            return StatusCodes(isSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, isSuccess ? "Email removed!" : response);
        }
        [HttpPost]
        [Route("SetPrimaryEmail")]
        public async Task<dynamic> SetPrimaryEmail(int emailId)
        {
            var res = await userOrganizationEmailActions.SetPrimaryEmail(emailId);
            return StatusCodes(res ? HttpStatusCode.OK : HttpStatusCode.BadRequest, string.Empty, res ? "Primary Email Set !" : "Email Not Found!");

        }
    }
}
