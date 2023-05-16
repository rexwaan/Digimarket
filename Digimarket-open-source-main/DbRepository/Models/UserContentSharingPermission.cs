using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentSharingPermission
    {
        public int UserContentSharingPermissionsId { get; set; }
        public ulong? IsPrivate { get; set; }
        public ulong? ShareAlsoWithStudentsOfAllOgranizations { get; set; }
        public ulong? ShareAlsoWithStudentsOfMyOgranizations { get; set; }
        public ulong? ShareToAllOgranizations { get; set; }
        public ulong? ShareToMyOgranizations { get; set; }
        public ulong? SharedWithSpecificPeople { get; set; }
        public int? PermissionsUserContentId { get; set; }
        public ulong? SharedToAll { get; set; }

        public virtual UserContent PermissionsUserContent { get; set; }
    }
}
