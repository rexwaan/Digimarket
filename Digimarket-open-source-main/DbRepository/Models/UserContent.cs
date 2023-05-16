using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContent
    {
        public UserContent()
        {
            CourseLessons = new HashSet<CourseLesson>();
            CourseScheduleCourseDetails = new HashSet<CourseScheduleCourseDetail>();
            InverseDuplicatedFromNavigation = new HashSet<UserContent>();
            SpecificUserPrmissions = new HashSet<SpecificUserPrmission>();
            UserContentAccessRequests = new HashSet<UserContentAccessRequest>();
            UserContentAttachments = new HashSet<UserContentAttachment>();
            UserContentMeta = new HashSet<UserContentMetum>();
            UserContentQuestions = new HashSet<UserContentQuestion>();
            UserContentScratchProjects = new HashSet<UserContentScratchProject>();
            UserContentSharingPermissions = new HashSet<UserContentSharingPermission>();
            UserContentGuid = Guid.NewGuid().ToString();
        }

        public int ContentId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public ulong IsDuplicate { get; set; }
        public int OrganizationId { get; set; }
        public int CreatedBy { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public int? DuplicatedFrom { get; set; }
        public string CreatedDate { get; set; }
        public string UserContentGuid { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual UserContent DuplicatedFromNavigation { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<CourseLesson> CourseLessons { get; set; }
        public virtual ICollection<CourseScheduleCourseDetail> CourseScheduleCourseDetails { get; set; }
        public virtual ICollection<UserContent> InverseDuplicatedFromNavigation { get; set; }
        public virtual ICollection<SpecificUserPrmission> SpecificUserPrmissions { get; set; }
        public virtual ICollection<UserContentAccessRequest> UserContentAccessRequests { get; set; }
        public virtual ICollection<UserContentAttachment> UserContentAttachments { get; set; }
        public virtual ICollection<UserContentMetum> UserContentMeta { get; set; }
        public virtual ICollection<UserContentQuestion> UserContentQuestions { get; set; }
        public virtual ICollection<UserContentScratchProject> UserContentScratchProjects { get; set; }
        public virtual ICollection<UserContentSharingPermission> UserContentSharingPermissions { get; set; }
    }
}
