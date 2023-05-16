using Core.Helper;
using DbRepository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Models
{
    public class CreateContentModel
    {
        public int contentId { get; set; }
        public int parentContentId { get; set; }
        public int userId { get; set; }
        public string name { get; set; }
        public bool? isDuplicate { get; set; }
        public int organizationId { get; set; }
        public int? createdBy { get; set; }
        public string shortDescription { get; set; }
        public string fullDescription { get; set; }
        public List<UserContentMetaModel> properties { get; set; }
        public List<UserContentAttachments> attachments { get; set; }
        public List<UserContentSharingPermissions> manageSharing { get; set; }
        public List<UserContentSpecificUsersPermission> sharingAddresses { get; set; }
        public List<UserContentQuestionDTO> questions { get; set; }
        public List<UserContentScratchProjectDTO> scratchProject { get; set; }


    }
    public class UserContentGetModel
    {
        public int contentId { get; set; }
        public int userId { get; set; }
        public UserDetails createdByDetails { get; set; }
        public string name { get; set; }
        public string logo { get; set; }
        public string shortDescription { get; set; }
        public string longDescription { get; set; }
        public UserDetails duplicatedFrom { get; set; }
        public string duplicatedFromLessonName { get; set; }
        public bool isDuplicated { get; set; }
        public List<UserContentMetaModel> properties { get; set; }
        public List<UserContentAttachments> attachments { get; set; }
        public List<UserContentSpecificUsersPermission> sharingAddresses { get; set; }
        public List<UserContentSharingPermissions> manageSharing { get; set; }
        public List<UserContentQuestionDTO> questions { get; set; }
        public List<UserContentScratchProjectDTO> scratchProject { get; set; }
        public bool hasAccess { get; set; }
        public int organizationId { get; set; }
    }
    public class UserContentMetaModel
    {
        public int metaId { get; set; }
        public string key { get; set; }
        public string value { get; set; }
        public MetaType metaType { get; set; }

    }

    public class UserContentAttachments
    {
        public int attachmentId { get; set; }
        public string attachmentKey { get; set; }
    }

    public class UserContentSpecificUsersPermission
    {
        public bool? isRequested { get; set; }
        public int? requestBy { get; set; }
        public int? approvedBy { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public bool? hasAccess { get; set; }
        public bool isDeleted { get; set; }
        public int userContentSpecificUsersPermissionId { get; set; }
    }
    public class UserContentQuestionDTO
    {
        public string questionDescription { get; set; }
        public int questionId { get; set; }
        public string question { get; set; }
        public List<string> answers { get; set; }
        public bool? isMultiSelect { get; set; }
    }
    public class UserContentScratchProjectDTO
    {
        public int scracthProjectId { get; set; }
        public string name { get; set; }
        public string link { get; set; }
    }
    public class UserContentSharingPermissions
    {
        public bool? isPrivate { get; set; }
        public bool? shareAlsoWithStudentsOfAllOgranizations { get; set; }
        public bool? shareAlsoWithStudentsOfMyOgranizations { get; set; }
        public bool? shareToAllOgranizations { get; set; }
        public bool? shareToMyOgranizations { get; set; }
        public bool? sharedWithSpecificPeople { get; set; }
        public bool? shareToAll { get; set; }

    }
    public class UserDetails
    {
        public int? userId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }

    }
    public class EmailDetails
    {
        public string name { get; set; }
        public string email { get; set; }
        public string token { get; set; }
    }
    public class ContentDetailsDTO
    {
        public List<UserContentQuestionDTO> questions { get; set; }
        public List<UserContentScratchProjectDTO> scratchProjects { get; set; }
        public List<UserContentMetaModel> resources { get; set; }
        public List<UserContentAttachments> attachments { get; set; }

    }
}
