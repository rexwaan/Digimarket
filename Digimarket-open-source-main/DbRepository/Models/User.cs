using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class User
    {
        public User()
        {
            ContactUs = new HashSet<ContactU>();
            CourseLocations = new HashSet<CourseLocation>();
            CourseScheduleAttendanceCreatedByNavigations = new HashSet<CourseScheduleAttendance>();
            CourseScheduleAttendanceUsers = new HashSet<CourseScheduleAttendance>();
            CourseScheduleCourseDetails = new HashSet<CourseScheduleCourseDetail>();
            CourseScheduleMembers = new HashSet<CourseScheduleMember>();
            CourseSchedules = new HashSet<CourseSchedule>();
            Courses = new HashSet<Course>();
            OnGoingClassForUsers = new HashSet<OnGoingClassForUser>();
            OrganizationApprovedByNavigations = new HashSet<Organization>();
            OrganizationCreatorNavigations = new HashSet<Organization>();
            OrganizationRejectedByNavigations = new HashSet<Organization>();
            OrganizationRequestOrganizationApprovedByNavigations = new HashSet<OrganizationRequest>();
            OrganizationRequestOrganizationRejectedByNavigations = new HashSet<OrganizationRequest>();
            RolePermissions = new HashSet<RolePermission>();
            Roles = new HashSet<Role>();
            SpecificUserPrmissionApprovedByNavigations = new HashSet<SpecificUserPrmission>();
            SpecificUserPrmissionRequestByNavigations = new HashSet<SpecificUserPrmission>();
            UserContentAccessRequests = new HashSet<UserContentAccessRequest>();
            UserContentAttachments = new HashSet<UserContentAttachment>();
            UserContentCreatedByNavigations = new HashSet<UserContent>();
            UserContentQuestions = new HashSet<UserContentQuestion>();
            UserContentScratchProjects = new HashSet<UserContentScratchProject>();
            UserContentUsers = new HashSet<UserContent>();
            UserInviteCreatedByNavigations = new HashSet<UserInvite>();
            UserInviteRegisteredUsers = new HashSet<UserInvite>();
            UserOrganizationCretaedByNavigations = new HashSet<UserOrganization>();
            UserOrganizationEmails = new HashSet<UserOrganizationEmail>();
            UserOrganizationRoles = new HashSet<UserOrganizationRole>();
            UserOrganizationUsers = new HashSet<UserOrganization>();
            UserRequestApprovedByNavigations = new HashSet<UserRequest>();
            UserRequestRejectedByNavigations = new HashSet<UserRequest>();
            UserRequestUsers = new HashSet<UserRequest>();
            UsernameLoginStudentCreatedByNavigations = new HashSet<UsernameLoginStudent>();
            UsernameLoginStudentLinkParents = new HashSet<UsernameLoginStudent>();
            UsernameLoginStudentUsers = new HashSet<UsernameLoginStudent>();
        }

        public int UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string CreatedDate { get; set; }
        public ulong? IsActive { get; set; }
        public ulong? IsRoot { get; set; }
        public int? ParentId { get; set; }
        public string Dob { get; set; }
        public string ContactNumber { get; set; }
        public ulong? IsPlatformAdmin { get; set; }
        public string Image { get; set; }

        public virtual ICollection<ContactU> ContactUs { get; set; }
        public virtual ICollection<CourseLocation> CourseLocations { get; set; }
        public virtual ICollection<CourseScheduleAttendance> CourseScheduleAttendanceCreatedByNavigations { get; set; }
        public virtual ICollection<CourseScheduleAttendance> CourseScheduleAttendanceUsers { get; set; }
        public virtual ICollection<CourseScheduleCourseDetail> CourseScheduleCourseDetails { get; set; }
        public virtual ICollection<CourseScheduleMember> CourseScheduleMembers { get; set; }
        public virtual ICollection<CourseSchedule> CourseSchedules { get; set; }
        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<OnGoingClassForUser> OnGoingClassForUsers { get; set; }
        public virtual ICollection<Organization> OrganizationApprovedByNavigations { get; set; }
        public virtual ICollection<Organization> OrganizationCreatorNavigations { get; set; }
        public virtual ICollection<Organization> OrganizationRejectedByNavigations { get; set; }
        public virtual ICollection<OrganizationRequest> OrganizationRequestOrganizationApprovedByNavigations { get; set; }
        public virtual ICollection<OrganizationRequest> OrganizationRequestOrganizationRejectedByNavigations { get; set; }
        public virtual ICollection<RolePermission> RolePermissions { get; set; }
        public virtual ICollection<Role> Roles { get; set; }
        public virtual ICollection<SpecificUserPrmission> SpecificUserPrmissionApprovedByNavigations { get; set; }
        public virtual ICollection<SpecificUserPrmission> SpecificUserPrmissionRequestByNavigations { get; set; }
        public virtual ICollection<UserContentAccessRequest> UserContentAccessRequests { get; set; }
        public virtual ICollection<UserContentAttachment> UserContentAttachments { get; set; }
        public virtual ICollection<UserContent> UserContentCreatedByNavigations { get; set; }
        public virtual ICollection<UserContentQuestion> UserContentQuestions { get; set; }
        public virtual ICollection<UserContentScratchProject> UserContentScratchProjects { get; set; }
        public virtual ICollection<UserContent> UserContentUsers { get; set; }
        public virtual ICollection<UserInvite> UserInviteCreatedByNavigations { get; set; }
        public virtual ICollection<UserInvite> UserInviteRegisteredUsers { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationCretaedByNavigations { get; set; }
        public virtual ICollection<UserOrganizationEmail> UserOrganizationEmails { get; set; }
        public virtual ICollection<UserOrganizationRole> UserOrganizationRoles { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationUsers { get; set; }
        public virtual ICollection<UserRequest> UserRequestApprovedByNavigations { get; set; }
        public virtual ICollection<UserRequest> UserRequestRejectedByNavigations { get; set; }
        public virtual ICollection<UserRequest> UserRequestUsers { get; set; }
        public virtual ICollection<UsernameLoginStudent> UsernameLoginStudentCreatedByNavigations { get; set; }
        public virtual ICollection<UsernameLoginStudent> UsernameLoginStudentLinkParents { get; set; }
        public virtual ICollection<UsernameLoginStudent> UsernameLoginStudentUsers { get; set; }
    }
}
