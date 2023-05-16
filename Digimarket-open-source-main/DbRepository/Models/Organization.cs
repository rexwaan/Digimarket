using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class Organization
    {
        public Organization()
        {
            ContactUs = new HashSet<ContactU>();
            CourseLocations = new HashSet<CourseLocation>();
            CourseSchedules = new HashSet<CourseSchedule>();
            Courses = new HashSet<Course>();
            Roles = new HashSet<Role>();
            UserContents = new HashSet<UserContent>();
            UserInvites = new HashSet<UserInvite>();
            UserOrganizationEmails = new HashSet<UserOrganizationEmail>();
            UserOrganizations = new HashSet<UserOrganization>();
            UserRequests = new HashSet<UserRequest>();
            UsernameLoginStudentOrganizations = new HashSet<UsernameLoginStudentOrganization>();
        }

        public int OrganizationId { get; set; }
        public string Name { get; set; }
        public string EndPoint { get; set; }
        public ulong? IsActive { get; set; }
        public string EmailAddress { get; set; }
        public string AboutOrganziation { get; set; }
        public string Logo { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public int? TypeOfOrganization { get; set; }
        public ulong? IsApproved { get; set; }
        public ulong? IsRejected { get; set; }
        public int? ApprovedBy { get; set; }
        public int? RejectedBy { get; set; }
        public string Reason { get; set; }
        public int? Creator { get; set; }
        public string CreatedDate { get; set; }
        public string UpdatedDate { get; set; }
        public ulong? IsDeleted { get; set; }

        public virtual User ApprovedByNavigation { get; set; }
        public virtual User CreatorNavigation { get; set; }
        public virtual User RejectedByNavigation { get; set; }
        public virtual ICollection<ContactU> ContactUs { get; set; }
        public virtual ICollection<CourseLocation> CourseLocations { get; set; }
        public virtual ICollection<CourseSchedule> CourseSchedules { get; set; }
        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<Role> Roles { get; set; }
        public virtual ICollection<UserContent> UserContents { get; set; }
        public virtual ICollection<UserInvite> UserInvites { get; set; }
        public virtual ICollection<UserOrganizationEmail> UserOrganizationEmails { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
        public virtual ICollection<UserRequest> UserRequests { get; set; }
        public virtual ICollection<UsernameLoginStudentOrganization> UsernameLoginStudentOrganizations { get; set; }
    }
}
