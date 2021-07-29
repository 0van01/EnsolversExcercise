using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace EnsolversExcercise.Models
{
    public partial class User
    {
        public User()
        {
            Folders = new HashSet<Folder>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Auth0ID { get; set; }

        [JsonIgnore]
        public virtual ICollection<Folder> Folders { get; set; }
    }
}
