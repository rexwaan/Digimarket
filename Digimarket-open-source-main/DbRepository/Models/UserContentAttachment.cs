using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentAttachment
    {
        public int AttachmentsId { get; set; }
        public int UserContentId { get; set; }
        public string AttachmentKey { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedDate { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual UserContent UserContent { get; set; }
    }
}
