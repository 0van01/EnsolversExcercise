using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace EnsolversExcercise.Models
{
    public partial class Folder
    {
        public Folder()
        {
            UserTasks = new HashSet<UserTask>();
        }

        public int FolderId { get; set; }
        public string FolderName { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }
        [JsonIgnore]
        public virtual ICollection<UserTask> UserTasks { get; set; }
    }
}
