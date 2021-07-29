using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace EnsolversExcercise.Models
{
    public partial class MOCKENSOLVERSContext : DbContext
    {
        public MOCKENSOLVERSContext()
        {
        }

        public MOCKENSOLVERSContext(DbContextOptions<MOCKENSOLVERSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Folder> Folders { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserTask> UserTasks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=.\\SQLEXPRESS;Initial catalog=MOCKENSOLVER;Integrated Security=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Folder>(entity =>
            {
                entity.ToTable("Folder");

                entity.Property(e => e.FolderId).HasColumnName("FolderID");

                entity.Property(e => e.FolderName)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Folders)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Folder__UserID__787EE5A0");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.Auth0ID)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserTask>(entity =>
            {
                entity.HasKey(e => e.TaskId)
                    .HasName("PK__UserTask__7C6949D1281B772A");

                entity.ToTable("UserTask");

                entity.Property(e => e.TaskId).HasColumnName("TaskID");

                entity.Property(e => e.Description)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FolderId).HasColumnName("FolderID");

                entity.HasOne(d => d.Folder)
                    .WithMany(p => p.UserTasks)
                    .HasForeignKey(d => d.FolderId)
                    .HasConstraintName("FK__UserTask__Folder__7B5B524B");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
