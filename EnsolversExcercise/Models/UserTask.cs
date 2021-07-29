using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace EnsolversExcercise.Models
{
    public partial class UserTask
    {
        public int TaskId { get; set; }
        public bool Status { get; set; }
        public string Description { get; set; }
        public int FolderId { get; set; }
        [JsonIgnore]
        public virtual Folder Folder { get; set; }
    }
}
