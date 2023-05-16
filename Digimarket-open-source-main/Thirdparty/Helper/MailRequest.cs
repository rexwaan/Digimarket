using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Thirdparty.Helper
{
    public class MailRequest
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        //public List<IFormFile> Attachments { get; set; }
    }
    /// <summary>
    /// Enum name is the email template name and description is the subject of the email
    /// </summary>
    public enum EmailType
    {
        // enum.GetDescription() to get string representation 
        [Description("Digimarket platform | organization registration request - [orgName] | [firstName] [lastName]")]
        Organization_Registration_Request = 1,
        [Description("Digimarket platform | organization registration update - [orgName] | [firstName] [lastName]")]
        Organization_Registration_Update = 2,
        [Description("userFirstName userLastName from [orgName] has invited you to view lesson [lessonName] | [inviteeName]")]
        Invite_From_Organization_For_Lesson = 3,
        [Description("Digimarket platform | [orgName] - registration approved | [firstName] [lastName]")]
        Organization_Registration_Approved = 4,
        [Description("Digimarket platform | [orgName] - registration rejected | [firstName] [lastName]")]
        Organization_Registration_Rejected = 5,
        [Description("[orgName] membership request - [firstName] [lastName] | Digimarket platform")]
        User_Membership_Request = 6,
        [Description("[orgName] membership request approval - [firstName] [lastName] | Digimarket platform")]
        User_Membership_Approved = 7,
        [Description("[orgName] membership request rejected - [firstName] [lastName] | Digimarket platform")]
        User_Membership_Rejectd = 8,
        [Description("[orgName] membership request confirmation - [firstName] [lastName] | Digimarket platform")]
        User_Membership_Request_Confirmation = 9,
        [Description("[orgName] contact us submitted - [firstName] [lastName] | Digimarket platform")]
        Contact_Us = 10,
        [Description("Invitation for [firstName] [lastName] to join [orgName] | Digimarket platform")]
        Invite_User_to_Organization = 11,
        [Description("[orgName] added [childFirstName] [childLastName] for your approval | Digimarket platform")]
        Admin_Add_Student_Approval_Request = 12,
        [Description("Password for [childFirstName] | Digimarket platform")]
        Parent_Approve_Student_Request= 13,
        [Description("Digimarket platform - Number of registration notification reached | [courseName] on [startDateTime]")]
        Max_No_Of_Students_Registered= 14,
        [Description("[orgName] contact us received | Digimarket platform")]
        Contact_Us_Notification = 15,
        [Description("Forget Password | DigiMarket Platform")]
        Forget_Password = 16,
        [Description("Digimarket platform - Number of registration notification reached | [lessonName]")]
        Max_Participants_Notification = 17,
        [Description("[userFirstName] [userLastName] from [orgName] has invited you to view lesson [lessonName] | [inviteeName]")]
        Invite_User_To_See_Lesson = 18,
        [Description("[userFirstName] [userLastName] from [orgName] has removed your access to view lesson [lessonName] | [inviteeName]")]
        Remove_User_To_See_Lesson = 19,
        [Description("Digimarket platform | Account deactivated for [firstName] [lastName] on [orgName]")]
        Deactivate_User = 20,
        [Description("Digimarket platform | Account reactivated for [firstName] [lastName] on [orgName]")]
        Reactivate_User = 21,
        [Description("Digimarket platform | add email address to my account | [firstName] [lastName]")]
        Add_New_Email = 22,
        [Description("[requesterName] [orgDetails] has requested access to lesson [lessonName] that you created")]
        Ask_Lesson_Owner_for_Access = 23,

        // last enum is 23
    }
}
