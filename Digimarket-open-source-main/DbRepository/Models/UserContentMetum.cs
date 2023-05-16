using System;
using System.Collections.Generic;

#nullable disable

namespace DbRepository.Models
{
    public partial class UserContentMetum
    {
        public int UserContentMetaId { get; set; }
        public int ContentId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public int? MetaType { get; set; }

        public virtual UserContent Content { get; set; }
    }
}
