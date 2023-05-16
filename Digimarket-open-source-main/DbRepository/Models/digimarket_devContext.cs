using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace DbRepository.Models
{
    public partial class digimarket_devContext : DbContext
    {
        public digimarket_devContext()
        {
        }

        public digimarket_devContext(DbContextOptions<digimarket_devContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admins { get; set; }
        public virtual DbSet<ContactU> ContactUs { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<CourseLesson> CourseLessons { get; set; }
        public virtual DbSet<CourseLocation> CourseLocations { get; set; }
        public virtual DbSet<CourseSchedule> CourseSchedules { get; set; }
        public virtual DbSet<CourseScheduleAttendance> CourseScheduleAttendances { get; set; }
        public virtual DbSet<CourseScheduleCourseDetail> CourseScheduleCourseDetails { get; set; }
        public virtual DbSet<CourseScheduleMember> CourseScheduleMembers { get; set; }
        public virtual DbSet<OnGoingClassForUser> OnGoingClassForUsers { get; set; }
        public virtual DbSet<Organization> Organizations { get; set; }
        public virtual DbSet<OrganizationOwner> OrganizationOwners { get; set; }
        public virtual DbSet<OrganizationRequest> OrganizationRequests { get; set; }
        public virtual DbSet<Parent> Parents { get; set; }
        public virtual DbSet<ParentStudent> ParentStudents { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }
        public virtual DbSet<Privillage> Privillages { get; set; }
        public virtual DbSet<PrivillagePermission> PrivillagePermissions { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<RolePermission> RolePermissions { get; set; }
        public virtual DbSet<SpecificUserPrmission> SpecificUserPrmissions { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<Teacher> Teachers { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserContent> UserContents { get; set; }
        public virtual DbSet<UserContentAccessRequest> UserContentAccessRequests { get; set; }
        public virtual DbSet<UserContentAttachment> UserContentAttachments { get; set; }
        public virtual DbSet<UserContentMetum> UserContentMeta { get; set; }
        public virtual DbSet<UserContentQuestion> UserContentQuestions { get; set; }
        public virtual DbSet<UserContentScratchProject> UserContentScratchProjects { get; set; }
        public virtual DbSet<UserContentSharingPermission> UserContentSharingPermissions { get; set; }
        public virtual DbSet<UserInvite> UserInvites { get; set; }
        public virtual DbSet<UserOrganization> UserOrganizations { get; set; }
        public virtual DbSet<UserOrganizationEmail> UserOrganizationEmails { get; set; }
        public virtual DbSet<UserOrganizationRole> UserOrganizationRoles { get; set; }
        public virtual DbSet<UserPrivillage> UserPrivillages { get; set; }
        public virtual DbSet<UserRegistration> UserRegistrations { get; set; }
        public virtual DbSet<UserRequest> UserRequests { get; set; }
        public virtual DbSet<UsernameLoginStudent> UsernameLoginStudents { get; set; }
        public virtual DbSet<UsernameLoginStudentOrganization> UsernameLoginStudentOrganizations { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("server=digimarket.cephcb4e9u5e.us-east-1.rds.amazonaws.com;port=33100;user=digimarketAdmin;password=CcFh2vrsinputJZ;database=digimarket_sprint_4", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.28-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasCharSet("utf8mb4")
                .UseCollation("utf8mb4_0900_ai_ci");

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("admin");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.AdminId).HasColumnName("admin_id");

                entity.Property(e => e.AdminTypeId)
                    .HasMaxLength(45)
                    .HasColumnName("admin_type_id");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");
            });

            modelBuilder.Entity<ContactU>(entity =>
            {
                entity.HasKey(e => e.ContactUsId)
                    .HasName("PRIMARY");

                entity.ToTable("contact_us");

                entity.HasIndex(e => e.CreatedBy, "contact_us_created_by_idx");

                entity.HasIndex(e => e.ContactUsOrganizationId, "contact_us_organization_id_idx");

                entity.Property(e => e.ContactUsId).HasColumnName("contact_us_id");

                entity.Property(e => e.ContactUsOrganizationId).HasColumnName("contact_us_organization_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(200)
                    .HasColumnName("emailAddress");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(200)
                    .HasColumnName("firstName");

                entity.Property(e => e.IsArchived)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_archived");

                entity.Property(e => e.LastName)
                    .HasMaxLength(200)
                    .HasColumnName("lastName");

                entity.Property(e => e.Message)
                    .HasMaxLength(1000)
                    .HasColumnName("message");

                entity.Property(e => e.Phone)
                    .HasMaxLength(200)
                    .HasColumnName("phone");

                entity.Property(e => e.Topic)
                    .HasMaxLength(200)
                    .HasColumnName("topic");

                entity.HasOne(d => d.ContactUsOrganization)
                    .WithMany(p => p.ContactUs)
                    .HasForeignKey(d => d.ContactUsOrganizationId)
                    .HasConstraintName("contact_us_organization_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ContactUs)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("contact_us_created_by");
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.ToTable("course");

                entity.HasIndex(e => e.CreatedBy, "course_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "course_organization_id_idx");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.CourseDescription)
                    .HasMaxLength(1000)
                    .HasColumnName("course_description");

                entity.Property(e => e.CourseName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("course_name");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(100)
                    .HasColumnName("created_date");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Courses)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.Courses)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_organization_id");
            });

            modelBuilder.Entity<CourseLesson>(entity =>
            {
                entity.ToTable("course_lesson");

                entity.HasIndex(e => e.CourseId, "course_lesson_course_id_idx");

                entity.HasIndex(e => e.UserContentId, "course_lesson_user_content_id_idx");

                entity.Property(e => e.CourseLessonId).HasColumnName("course_lesson_id");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.UserContentId).HasColumnName("user_content_id");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseLessons)
                    .HasForeignKey(d => d.CourseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_lesson_course_id");

                entity.HasOne(d => d.UserContent)
                    .WithMany(p => p.CourseLessons)
                    .HasForeignKey(d => d.UserContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_lesson_user_content_id");
            });

            modelBuilder.Entity<CourseLocation>(entity =>
            {
                entity.ToTable("course_location");

                entity.HasIndex(e => e.CreatedBy, "course_location_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "course_location_organization_id_idx");

                entity.Property(e => e.CourseLocationId).HasColumnName("course_location_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(100)
                    .HasColumnName("created_date");

                entity.Property(e => e.Details)
                    .HasMaxLength(1000)
                    .HasColumnName("details");

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("location");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CourseLocations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_location_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.CourseLocations)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_location_organization_id");
            });

            modelBuilder.Entity<CourseSchedule>(entity =>
            {
                entity.ToTable("course_schedule");

                entity.HasIndex(e => e.CourseId, "course_schedule_course_id_idx");

                entity.HasIndex(e => e.CreatedBy, "course_schedule_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "course_schedule_organization_id_idx");

                entity.Property(e => e.CourseScheduleId).HasColumnName("course_schedule_id");

                entity.Property(e => e.CourseId).HasColumnName("course_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(1000)
                    .HasColumnName("created_date");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.CourseSchedules)
                    .HasForeignKey(d => d.CourseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_course_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CourseSchedules)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.CourseSchedules)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_organization_id");
            });

            modelBuilder.Entity<CourseScheduleAttendance>(entity =>
            {
                entity.ToTable("course_schedule_attendance");

                entity.HasIndex(e => e.CreatedBy, "course_schedule_attendance_created_by_idx");

                entity.HasIndex(e => e.UserId, "course_schedule_attendance_user_id_idx");

                entity.HasIndex(e => e.CourseScheduleCourseDetailsId, "course_schedule_course_details_id_idx");

                entity.Property(e => e.CourseScheduleAttendanceId).HasColumnName("course_schedule_attendance_id");

                entity.Property(e => e.CourseScheduleCourseDetailsId).HasColumnName("course_schedule_course_details_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.IsPresent)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_present");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.CourseScheduleCourseDetails)
                    .WithMany(p => p.CourseScheduleAttendances)
                    .HasForeignKey(d => d.CourseScheduleCourseDetailsId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_course_details_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CourseScheduleAttendanceCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_attendance_created_by");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CourseScheduleAttendanceUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_attendance_user_id");
            });

            modelBuilder.Entity<CourseScheduleCourseDetail>(entity =>
            {
                entity.HasKey(e => e.CourseScheduleCourseDetailsId)
                    .HasName("PRIMARY");

                entity.ToTable("course_schedule_course_details");

                entity.HasIndex(e => e.CourseScheduleId, "course_schedule_course_details_course_schedule_id_idx");

                entity.HasIndex(e => e.LocationId, "course_schedule_course_details_location_id_idx");

                entity.HasIndex(e => e.TeacherId, "course_schedule_course_details_teacher_id_idx");

                entity.HasIndex(e => e.UserContentId, "course_schedule_course_details_user_content_id_idx");

                entity.Property(e => e.CourseScheduleCourseDetailsId).HasColumnName("course_schedule_course_details_id");

                entity.Property(e => e.CourseScheduleId).HasColumnName("course_schedule_id");

                entity.Property(e => e.DateTime)
                    .HasMaxLength(100)
                    .HasColumnName("date_time");

                entity.Property(e => e.LocationId).HasColumnName("location_id");

                entity.Property(e => e.MaxParticipantsCount).HasColumnName("max_participants_count");

                entity.Property(e => e.ParticipantNotificationThreshold).HasColumnName("participant_notification_threshold");

                entity.Property(e => e.TeacherId).HasColumnName("teacher_id");

                entity.Property(e => e.UserContentId).HasColumnName("user_content_id");

                entity.HasOne(d => d.CourseSchedule)
                    .WithMany(p => p.CourseScheduleCourseDetails)
                    .HasForeignKey(d => d.CourseScheduleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_course_details_course_schedule_id");

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.CourseScheduleCourseDetails)
                    .HasForeignKey(d => d.LocationId)
                    .HasConstraintName("course_schedule_course_details_location_id");

                entity.HasOne(d => d.Teacher)
                    .WithMany(p => p.CourseScheduleCourseDetails)
                    .HasForeignKey(d => d.TeacherId)
                    .HasConstraintName("course_schedule_course_details_teacher_id");

                entity.HasOne(d => d.UserContent)
                    .WithMany(p => p.CourseScheduleCourseDetails)
                    .HasForeignKey(d => d.UserContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_course_details_user_content_id");
            });

            modelBuilder.Entity<CourseScheduleMember>(entity =>
            {
                entity.HasKey(e => e.CourseScheduleMembersId)
                    .HasName("PRIMARY");

                entity.ToTable("course_schedule_members");

                entity.HasIndex(e => e.CourseScheduleCourseDetails, "course_schedule_details_idx");

                entity.HasIndex(e => e.UserId, "course_schedule_member_user_id_idx");

                entity.Property(e => e.CourseScheduleMembersId).HasColumnName("course_schedule_members_id");

                entity.Property(e => e.CourseScheduleCourseDetails).HasColumnName("course_schedule_course_details");

                entity.Property(e => e.MemberType).HasColumnName("member_type");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.CourseScheduleCourseDetailsNavigation)
                    .WithMany(p => p.CourseScheduleMembers)
                    .HasForeignKey(d => d.CourseScheduleCourseDetails)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_details");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CourseScheduleMembers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("course_schedule_member_user_id");
            });

            modelBuilder.Entity<OnGoingClassForUser>(entity =>
            {
                entity.ToTable("on_going_class_for_user");

                entity.HasIndex(e => e.CourseScheduleCourseDetailsId, "on_going_class_for_user_course_schedule_course_details_id_idx");

                entity.HasIndex(e => e.UserId, "on_going_class_for_user_user_id_idx");

                entity.Property(e => e.OnGoingClassForUserId).HasColumnName("on_going_class_for_user_id");

                entity.Property(e => e.CourseScheduleCourseDetailsId).HasColumnName("course_schedule_course_details_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.CourseScheduleCourseDetails)
                    .WithMany(p => p.OnGoingClassForUsers)
                    .HasForeignKey(d => d.CourseScheduleCourseDetailsId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("on_going_class_for_user_course_schedule_course_details_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.OnGoingClassForUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("on_going_class_for_user_user_id");
            });

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.ToTable("organization");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.HasIndex(e => e.ApprovedBy, "approved_by_idx");

                entity.HasIndex(e => e.Creator, "organization_creator_idx");

                entity.HasIndex(e => e.RejectedBy, "rejected_by_idx");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.AboutOrganziation)
                    .HasMaxLength(1000)
                    .HasColumnName("about_organziation");

                entity.Property(e => e.Address)
                    .HasMaxLength(100)
                    .HasColumnName("address");

                entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(45)
                    .HasColumnName("contact_number");

                entity.Property(e => e.Country)
                    .HasMaxLength(45)
                    .HasColumnName("country");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.Creator).HasColumnName("creator");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.EndPoint)
                    .HasMaxLength(45)
                    .HasColumnName("end_point");

                entity.Property(e => e.IsActive)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_active");

                entity.Property(e => e.IsApproved)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_approved");

                entity.Property(e => e.IsDeleted)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_deleted");

                entity.Property(e => e.IsRejected)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_rejected");

                entity.Property(e => e.Logo)
                    .HasMaxLength(1000)
                    .HasColumnName("logo");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.Reason)
                    .HasMaxLength(2000)
                    .HasColumnName("reason");

                entity.Property(e => e.RejectedBy).HasColumnName("rejected_by");

                entity.Property(e => e.TypeOfOrganization).HasColumnName("type_of_organization");

                entity.Property(e => e.UpdatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("updated_date");

                entity.HasOne(d => d.ApprovedByNavigation)
                    .WithMany(p => p.OrganizationApprovedByNavigations)
                    .HasForeignKey(d => d.ApprovedBy)
                    .HasConstraintName("approved_by");

                entity.HasOne(d => d.CreatorNavigation)
                    .WithMany(p => p.OrganizationCreatorNavigations)
                    .HasForeignKey(d => d.Creator)
                    .HasConstraintName("creator");

                entity.HasOne(d => d.RejectedByNavigation)
                    .WithMany(p => p.OrganizationRejectedByNavigations)
                    .HasForeignKey(d => d.RejectedBy)
                    .HasConstraintName("rejected_by");
            });

            modelBuilder.Entity<OrganizationOwner>(entity =>
            {
                entity.HasKey(e => e.OrganizationUserId)
                    .HasName("PRIMARY");

                entity.ToTable("organization_owner");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.OrganizationUserId).HasColumnName("organization_user_id");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(65)
                    .HasColumnName("email_address");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(45)
                    .HasColumnName("first_name");

                entity.Property(e => e.LastName)
                    .HasMaxLength(45)
                    .HasColumnName("last_name");

                entity.Property(e => e.MiddleName)
                    .HasMaxLength(45)
                    .HasColumnName("middle_name");

                entity.Property(e => e.ProfileInfo)
                    .HasMaxLength(5000)
                    .HasColumnName("Profile_info");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<OrganizationRequest>(entity =>
            {
                entity.ToTable("organization_request");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.HasIndex(e => e.OrganizationApprovedBy, "organization_approved_by_id");

                entity.HasIndex(e => e.OrganizationRejectedBy, "organization_rejected_by_id");

                entity.Property(e => e.OrganizationRequestId).HasColumnName("organization_request_id");

                entity.Property(e => e.About)
                    .HasMaxLength(200)
                    .HasColumnName("about");

                entity.Property(e => e.Address)
                    .HasMaxLength(200)
                    .HasColumnName("address");

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(200)
                    .HasColumnName("contact_number");

                entity.Property(e => e.Country)
                    .HasMaxLength(200)
                    .HasColumnName("country");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(45)
                    .HasColumnName("first_name");

                entity.Property(e => e.IsEditRequest)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_edit_request");

                entity.Property(e => e.LastName)
                    .HasMaxLength(45)
                    .HasColumnName("last_name");

                entity.Property(e => e.Logo)
                    .HasMaxLength(200)
                    .HasColumnName("logo");

                entity.Property(e => e.OrganizationApprovedBy).HasColumnName("organization_approved_by");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.OrganizationIsApproved)
                    .HasColumnType("bit(1)")
                    .HasColumnName("organization_is_approved");

                entity.Property(e => e.OrganizationIsRejected)
                    .HasColumnType("bit(1)")
                    .HasColumnName("organization_is_rejected");

                entity.Property(e => e.OrganizationName)
                    .HasMaxLength(45)
                    .HasColumnName("organization_name");

                entity.Property(e => e.OrganizationRejectedBy).HasColumnName("organization_rejected_by");

                entity.Property(e => e.OrganizationType).HasColumnName("organization_type");

                entity.Property(e => e.Reason)
                    .HasMaxLength(200)
                    .HasColumnName("reason");

                entity.HasOne(d => d.OrganizationApprovedByNavigation)
                    .WithMany(p => p.OrganizationRequestOrganizationApprovedByNavigations)
                    .HasForeignKey(d => d.OrganizationApprovedBy)
                    .HasConstraintName("organization_approved_by");

                entity.HasOne(d => d.OrganizationRejectedByNavigation)
                    .WithMany(p => p.OrganizationRequestOrganizationRejectedByNavigations)
                    .HasForeignKey(d => d.OrganizationRejectedBy)
                    .HasConstraintName("organization_rejected_by");
            });

            modelBuilder.Entity<Parent>(entity =>
            {
                entity.ToTable("parent");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.ParentId).HasColumnName("parent_id");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");

                entity.Property(e => e.UserName)
                    .HasMaxLength(45)
                    .HasColumnName("user_name");
            });

            modelBuilder.Entity<ParentStudent>(entity =>
            {
                entity.ToTable("parent_student");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.ParentStudentId).HasColumnName("Parent_student_id");

                entity.Property(e => e.OrganizationId)
                    .HasMaxLength(45)
                    .HasColumnName("organization_id");

                entity.Property(e => e.ParentId)
                    .HasMaxLength(45)
                    .HasColumnName("parent_id");

                entity.Property(e => e.RelationType)
                    .HasMaxLength(45)
                    .HasColumnName("relation_type");

                entity.Property(e => e.StudentId)
                    .HasMaxLength(45)
                    .HasColumnName("student_id");
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("permission");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.PermissionId).HasColumnName("permission_id");

                entity.Property(e => e.Description)
                    .HasMaxLength(4000)
                    .HasColumnName("description");

                entity.Property(e => e.DisplayName)
                    .HasMaxLength(100)
                    .HasColumnName("display_name");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Privillage>(entity =>
            {
                entity.ToTable("privillage");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.PrivillageId)
                    .ValueGeneratedNever()
                    .HasColumnName("privillage_id");

                entity.Property(e => e.Details)
                    .HasMaxLength(45)
                    .HasColumnName("details");

                entity.Property(e => e.IsMandatory)
                    .HasMaxLength(45)
                    .HasColumnName("is_mandatory");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.OrganizationId)
                    .HasMaxLength(45)
                    .HasColumnName("organization_id");
            });

            modelBuilder.Entity<PrivillagePermission>(entity =>
            {
                entity.HasKey(e => e.RolePermissionId)
                    .HasName("PRIMARY");

                entity.ToTable("privillage_permission");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.RolePermissionId)
                    .ValueGeneratedNever()
                    .HasColumnName("role_permission_id");

                entity.Property(e => e.OrganizationId)
                    .HasMaxLength(45)
                    .HasColumnName("organization_id");

                entity.Property(e => e.PermissionId)
                    .HasMaxLength(45)
                    .HasColumnName("permission_id");

                entity.Property(e => e.RoleId)
                    .HasMaxLength(45)
                    .HasColumnName("role_id");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.HasIndex(e => e.CreatedBy, "role_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "role_organization_id_idx");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.Details)
                    .HasMaxLength(1000)
                    .HasColumnName("details");

                entity.Property(e => e.DisplayName)
                    .HasMaxLength(45)
                    .HasColumnName("display_name");

                entity.Property(e => e.IsMandatory)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_mandatory");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Roles)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("role_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.Roles)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("role_organization_id");
            });

            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.ToTable("role_permission");

                entity.HasIndex(e => e.PermissionId, "permission_id_idx");

                entity.HasIndex(e => e.RoleId, "role_id_idx");

                entity.HasIndex(e => e.CreatedBy, "role_permission_created_by_idx");

                entity.Property(e => e.RolePermissionId).HasColumnName("role_permission_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.PermissionId).HasColumnName("permission_id");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("role_permission_created_by");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("permission_id");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("role_id");
            });

            modelBuilder.Entity<SpecificUserPrmission>(entity =>
            {
                entity.ToTable("specific_user_prmission");

                entity.HasIndex(e => e.ApprovedBy, "specific_user_prmission_approved_by_idx");

                entity.HasIndex(e => e.ContentId, "specific_user_prmission_content_id_idx");

                entity.HasIndex(e => e.RequestBy, "specific_user_prmission_request_by_idx");

                entity.Property(e => e.SpecificUserPrmissionId).HasColumnName("specific_user_prmission_id");

                entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");

                entity.Property(e => e.ContentId).HasColumnName("content_id");

                entity.Property(e => e.Email)
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.IsRequested)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_requested");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.RequestBy).HasColumnName("request_by");

                entity.Property(e => e.Token)
                    .HasMaxLength(1000)
                    .HasColumnName("token");

                entity.HasOne(d => d.ApprovedByNavigation)
                    .WithMany(p => p.SpecificUserPrmissionApprovedByNavigations)
                    .HasForeignKey(d => d.ApprovedBy)
                    .HasConstraintName("specific_user_prmission_approved_by");

                entity.HasOne(d => d.Content)
                    .WithMany(p => p.SpecificUserPrmissions)
                    .HasForeignKey(d => d.ContentId)
                    .HasConstraintName("specific_user_prmission_content_id");

                entity.HasOne(d => d.RequestByNavigation)
                    .WithMany(p => p.SpecificUserPrmissionRequestByNavigations)
                    .HasForeignKey(d => d.RequestBy)
                    .HasConstraintName("specific_user_prmission_request_by");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("student");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.StudentId).HasColumnName("student_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.CreatedIp)
                    .HasMaxLength(45)
                    .HasColumnName("created_ip");

                entity.Property(e => e.Dob)
                    .HasMaxLength(45)
                    .HasColumnName("dob");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(45)
                    .HasColumnName("first_name");

                entity.Property(e => e.HasEmail)
                    .HasColumnType("bit(1)")
                    .HasColumnName("has_email");

                entity.Property(e => e.LastName)
                    .HasMaxLength(45)
                    .HasColumnName("last_name");

                entity.Property(e => e.MiddleName)
                    .HasMaxLength(45)
                    .HasColumnName("middle_name");

                entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");

                entity.Property(e => e.ModifiedDate)
                    .HasMaxLength(45)
                    .HasColumnName("modified_date");

                entity.Property(e => e.ModifiedId)
                    .HasMaxLength(45)
                    .HasColumnName("modified_id");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");

                entity.Property(e => e.UserName)
                    .HasMaxLength(45)
                    .HasColumnName("user_name");
            });

            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.ToTable("teacher");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.TeacherId).HasColumnName("teacher_id");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");

                entity.Property(e => e.UserName)
                    .HasMaxLength(45)
                    .HasColumnName("user_name");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(45)
                    .HasColumnName("contact_number");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.Dob)
                    .HasMaxLength(45)
                    .HasColumnName("dob");

                entity.Property(e => e.Email)
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.Firstname)
                    .HasMaxLength(45)
                    .HasColumnName("firstname");

                entity.Property(e => e.Image)
                    .HasMaxLength(1000)
                    .HasColumnName("image");

                entity.Property(e => e.IsActive)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_Active");

                entity.Property(e => e.IsPlatformAdmin)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_platform_admin");

                entity.Property(e => e.IsRoot)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_root");

                entity.Property(e => e.Lastname)
                    .HasMaxLength(45)
                    .HasColumnName("lastname");

                entity.Property(e => e.ParentId).HasColumnName("parent_id");

                entity.Property(e => e.Password)
                    .HasMaxLength(45)
                    .HasColumnName("password");
            });

            modelBuilder.Entity<UserContent>(entity =>
            {
                entity.HasKey(e => e.ContentId)
                    .HasName("PRIMARY");

                entity.ToTable("user_content");

                entity.HasIndex(e => e.CreatedBy, "created_by_idx");

                entity.HasIndex(e => e.DuplicatedFrom, "duplicated_from_idx");

                entity.HasIndex(e => e.OrganizationId, "organization_id_idx");

                entity.HasIndex(e => e.UserId, "user_id_idx");

                entity.Property(e => e.ContentId).HasColumnName("content_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.DuplicatedFrom).HasColumnName("duplicated_from");

                entity.Property(e => e.IsDuplicate)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_duplicate");

                entity.Property(e => e.LongDescription).HasColumnName("long_description");

                entity.Property(e => e.Name)
                    .HasMaxLength(1000)
                    .HasColumnName("name");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.ShortDescription).HasColumnName("short_description");

                entity.Property(e => e.UserContentGuid)
                    .HasMaxLength(300)
                    .HasColumnName("user_content_guid");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserContentCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("created_by");

                entity.HasOne(d => d.DuplicatedFromNavigation)
                    .WithMany(p => p.InverseDuplicatedFromNavigation)
                    .HasForeignKey(d => d.DuplicatedFrom)
                    .HasConstraintName("duplicated_from");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UserContents)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("organization_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserContentUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_id");
            });

            modelBuilder.Entity<UserContentAccessRequest>(entity =>
            {
                entity.ToTable("user_content_access_request");

                entity.HasIndex(e => e.ContentId, "user_content_access_request_content_id_idx");

                entity.HasIndex(e => e.RequestBy, "user_content_access_request_requested_by_idx");

                entity.Property(e => e.UserContentAccessRequestId).HasColumnName("user_content_access_request_id");

                entity.Property(e => e.Approved)
                    .HasColumnType("bit(1)")
                    .HasColumnName("approved");

                entity.Property(e => e.ApprovedDate)
                    .HasMaxLength(45)
                    .HasColumnName("approved_date");

                entity.Property(e => e.ContentId).HasColumnName("content_id");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.RequestBy).HasColumnName("request_by");

                entity.Property(e => e.RequestedDate)
                    .HasMaxLength(100)
                    .HasColumnName("requested_date");

                entity.HasOne(d => d.Content)
                    .WithMany(p => p.UserContentAccessRequests)
                    .HasForeignKey(d => d.ContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_access_request_content_id");

                entity.HasOne(d => d.RequestByNavigation)
                    .WithMany(p => p.UserContentAccessRequests)
                    .HasForeignKey(d => d.RequestBy)
                    .HasConstraintName("user_content_access_request_requested_by");
            });

            modelBuilder.Entity<UserContentAttachment>(entity =>
            {
                entity.HasKey(e => e.AttachmentsId)
                    .HasName("PRIMARY");

                entity.ToTable("user_content_attachments");

                entity.HasIndex(e => e.CreatedBy, "attachments_created_by_idx");

                entity.HasIndex(e => e.UserContentId, "user_content_id_idx");

                entity.Property(e => e.AttachmentsId).HasColumnName("attachments_id");

                entity.Property(e => e.AttachmentKey)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("attachment_key");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.UserContentId).HasColumnName("user_content_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserContentAttachments)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("attachments_created_by");

                entity.HasOne(d => d.UserContent)
                    .WithMany(p => p.UserContentAttachments)
                    .HasForeignKey(d => d.UserContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("attachments_user_content_id");
            });

            modelBuilder.Entity<UserContentMetum>(entity =>
            {
                entity.HasKey(e => e.UserContentMetaId)
                    .HasName("PRIMARY");

                entity.ToTable("user_content_meta");

                entity.HasIndex(e => e.ContentId, "user_content_id_idx");

                entity.Property(e => e.UserContentMetaId).HasColumnName("user_content_meta_id");

                entity.Property(e => e.ContentId).HasColumnName("content_id");

                entity.Property(e => e.Key)
                    .HasMaxLength(100)
                    .HasColumnName("key");

                entity.Property(e => e.MetaType).HasColumnName("meta_type");

                entity.Property(e => e.Value)
                    .HasMaxLength(1000)
                    .HasColumnName("value");

                entity.HasOne(d => d.Content)
                    .WithMany(p => p.UserContentMeta)
                    .HasForeignKey(d => d.ContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_id");
            });

            modelBuilder.Entity<UserContentQuestion>(entity =>
            {
                entity.ToTable("user_content_question");

                entity.HasIndex(e => e.CreatedBy, "user_content_question_created_by_idx");

                entity.HasIndex(e => e.UserContentId, "user_content_question_user_content_id_idx");

                entity.Property(e => e.UserContentQuestionId).HasColumnName("user_content_question_id");

                entity.Property(e => e.Answers)
                    .HasMaxLength(2000)
                    .HasColumnName("answers");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.IsMultiselect)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_multiselect");

                entity.Property(e => e.Question)
                    .HasMaxLength(2000)
                    .HasColumnName("question");

                entity.Property(e => e.QuestionDescription)
                    .HasMaxLength(2000)
                    .HasColumnName("question_description");

                entity.Property(e => e.UserContentId).HasColumnName("user_content_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserContentQuestions)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_question_created_by");

                entity.HasOne(d => d.UserContent)
                    .WithMany(p => p.UserContentQuestions)
                    .HasForeignKey(d => d.UserContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_question_user_content_id");
            });

            modelBuilder.Entity<UserContentScratchProject>(entity =>
            {
                entity.ToTable("user_content_scratch_project");

                entity.HasIndex(e => e.UserContentId, "user_content_scratch_project_content_id_idx");

                entity.HasIndex(e => e.CreatedBy, "user_content_scratch_project_created_by_idx");

                entity.Property(e => e.UserContentScratchProjectId).HasColumnName("user_content_scratch_project_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.Link)
                    .HasMaxLength(2000)
                    .HasColumnName("link");

                entity.Property(e => e.Name)
                    .HasMaxLength(1000)
                    .HasColumnName("name");

                entity.Property(e => e.UserContentId).HasColumnName("user_content_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserContentScratchProjects)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_scratch_project_created_by");

                entity.HasOne(d => d.UserContent)
                    .WithMany(p => p.UserContentScratchProjects)
                    .HasForeignKey(d => d.UserContentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_content_scratch_project_content_id");
            });

            modelBuilder.Entity<UserContentSharingPermission>(entity =>
            {
                entity.HasKey(e => e.UserContentSharingPermissionsId)
                    .HasName("PRIMARY");

                entity.ToTable("user_content_sharing_permissions");

                entity.HasIndex(e => e.PermissionsUserContentId, "permissions_user_content_id_idx");

                entity.Property(e => e.UserContentSharingPermissionsId).HasColumnName("user_content_sharing_permissions_id");

                entity.Property(e => e.IsPrivate)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_private");

                entity.Property(e => e.PermissionsUserContentId).HasColumnName("permissions_user_content_id");

                entity.Property(e => e.ShareAlsoWithStudentsOfAllOgranizations)
                    .HasColumnType("bit(1)")
                    .HasColumnName("share_also_with_students_of_all_ogranizations");

                entity.Property(e => e.ShareAlsoWithStudentsOfMyOgranizations)
                    .HasColumnType("bit(1)")
                    .HasColumnName("share_also_with_students_of_my_ogranizations");

                entity.Property(e => e.ShareToAllOgranizations)
                    .HasColumnType("bit(1)")
                    .HasColumnName("share_to_all_ogranizations");

                entity.Property(e => e.ShareToMyOgranizations)
                    .HasColumnType("bit(1)")
                    .HasColumnName("share_to_my_ogranizations");

                entity.Property(e => e.SharedToAll)
                    .HasColumnType("bit(1)")
                    .HasColumnName("shared_to_all");

                entity.Property(e => e.SharedWithSpecificPeople)
                    .HasColumnType("bit(1)")
                    .HasColumnName("shared_with_specific_people");

                entity.HasOne(d => d.PermissionsUserContent)
                    .WithMany(p => p.UserContentSharingPermissions)
                    .HasForeignKey(d => d.PermissionsUserContentId)
                    .HasConstraintName("permissions_user_content_id");
            });

            modelBuilder.Entity<UserInvite>(entity =>
            {
                entity.ToTable("user_invite");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.HasIndex(e => e.CreatedBy, "user_invite_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "user_invite_organization_id_idx");

                entity.HasIndex(e => e.RegisteredUserId, "user_invite_registered_user_id_idx");

                entity.HasIndex(e => e.RoleId, "user_invite_role_id_idx");

                entity.Property(e => e.UserInviteId).HasColumnName("user_invite_id");

                entity.Property(e => e.Accepted)
                    .HasColumnType("bit(1)")
                    .HasColumnName("accepted");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(100)
                    .HasColumnName("created_date");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(100)
                    .HasColumnName("email_address");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .HasColumnName("first_name");

                entity.Property(e => e.IsInvitationSent)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_invitation_sent");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("last_name");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.RegisteredUserId).HasColumnName("registered_user_id");

                entity.Property(e => e.Rejected)
                    .HasColumnType("bit(1)")
                    .HasColumnName("rejected");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserInviteCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_invite_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UserInvites)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_invite_organization_id");

                entity.HasOne(d => d.RegisteredUser)
                    .WithMany(p => p.UserInviteRegisteredUsers)
                    .HasForeignKey(d => d.RegisteredUserId)
                    .HasConstraintName("user_invite_registered_user_id");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserInvites)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_invite_role_id");
            });

            modelBuilder.Entity<UserOrganization>(entity =>
            {
                entity.ToTable("user_organization");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.HasIndex(e => e.CretaedBy, "user_organization_created_by_idx");

                entity.HasIndex(e => e.OrganizationId, "user_organization_organization_id_idx");

                entity.HasIndex(e => e.UserId, "user_organization_user_id_idx");

                entity.Property(e => e.UserOrganizationId).HasColumnName("user_organization_id");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.CretaedBy).HasColumnName("cretaed_by");

                entity.Property(e => e.IsActive)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_active");

                entity.Property(e => e.IsLinked)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_linked");

                entity.Property(e => e.IsSelected)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_selected");

                entity.Property(e => e.LinkedUserOrganizationId).HasColumnName("linked_user_organization_id");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.CretaedByNavigation)
                    .WithMany(p => p.UserOrganizationCretaedByNavigations)
                    .HasForeignKey(d => d.CretaedBy)
                    .HasConstraintName("user_organization_created_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UserOrganizations)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_organization_organization_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserOrganizationUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_organization_user_id");
            });

            modelBuilder.Entity<UserOrganizationEmail>(entity =>
            {
                entity.ToTable("user_organization_emails");

                entity.HasIndex(e => e.OrganizationId, "user_organization_email_organization_id_idx");

                entity.HasIndex(e => e.UserId, "user_organization_email_user_id_idx");

                entity.Property(e => e.UserOrganizationEmailId).HasColumnName("user_organization_email_id");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.IsNotificationOn)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_notification_on");

                entity.Property(e => e.IsPrimary)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_primary");

                entity.Property(e => e.IsVerified)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_verified");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.Pin).HasColumnName("pin");

                entity.Property(e => e.PinGeneratedAt)
                    .HasMaxLength(45)
                    .HasColumnName("pin_generated_at");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UserOrganizationEmails)
                    .HasForeignKey(d => d.OrganizationId)
                    .HasConstraintName("user_organization_email_organization_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserOrganizationEmails)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_organization_email_user_id");
            });

            modelBuilder.Entity<UserOrganizationRole>(entity =>
            {
                entity.ToTable("user_organization_role");

                entity.HasIndex(e => e.RoleId, "role_id_idx");

                entity.HasIndex(e => e.UserOrganizationId, "user_organization_id_idx");

                entity.HasIndex(e => e.CreatedBy, "user_organization_role_created_by_idx");

                entity.Property(e => e.UserOrganizationRoleId).HasColumnName("user_organization_role_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.UserOrganizationId).HasColumnName("user_organization_id");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UserOrganizationRoles)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("user_organization_role_created_by");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserOrganizationRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_oganization_role_id");

                entity.HasOne(d => d.UserOrganization)
                    .WithMany(p => p.UserOrganizationRoles)
                    .HasForeignKey(d => d.UserOrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_organization_id");
            });

            modelBuilder.Entity<UserPrivillage>(entity =>
            {
                entity.ToTable("user_privillage");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.UserPrivillageId).HasColumnName("user_privillage_id");

                entity.Property(e => e.OrganizationId)
                    .HasMaxLength(45)
                    .HasColumnName("organization_id");

                entity.Property(e => e.PrivillageId)
                    .HasMaxLength(45)
                    .HasColumnName("privillage_id");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");
            });

            modelBuilder.Entity<UserRegistration>(entity =>
            {
                entity.ToTable("user_registration");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_general_ci");

                entity.Property(e => e.UserRegistrationId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_registration_id");

                entity.Property(e => e.City)
                    .HasMaxLength(45)
                    .HasColumnName("city");

                entity.Property(e => e.ConvertedId)
                    .HasMaxLength(45)
                    .HasColumnName("converted_id");

                entity.Property(e => e.Country)
                    .HasMaxLength(45)
                    .HasColumnName("country");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(45)
                    .HasColumnName("email_address");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(45)
                    .HasColumnName("first_name");

                entity.Property(e => e.IsApproved)
                    .HasMaxLength(45)
                    .HasColumnName("is_approved");

                entity.Property(e => e.LastName)
                    .HasMaxLength(45)
                    .HasColumnName("last_name");

                entity.Property(e => e.MiddleName)
                    .HasMaxLength(45)
                    .HasColumnName("middle_name");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(45)
                    .HasColumnName("phone_number");

                entity.Property(e => e.Province)
                    .HasMaxLength(45)
                    .HasColumnName("province");

                entity.Property(e => e.UserType)
                    .HasMaxLength(45)
                    .HasColumnName("user_type");
            });

            modelBuilder.Entity<UserRequest>(entity =>
            {
                entity.ToTable("user_request");

                entity.HasIndex(e => e.ApprovedBy, "user_request_approved_by_idx");

                entity.HasIndex(e => e.OrganizationId, "user_request_organization_id_idx");

                entity.HasIndex(e => e.RejectedBy, "user_request_rejected_by_idx");

                entity.HasIndex(e => e.RoleId, "user_request_role_id_idx");

                entity.HasIndex(e => e.UserId, "user_request_user_id_idx");

                entity.Property(e => e.UserRequestId).HasColumnName("user_request_id");

                entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(45)
                    .HasColumnName("contact_number");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(45)
                    .HasColumnName("created_date");

                entity.Property(e => e.Dob)
                    .HasMaxLength(45)
                    .HasColumnName("dob");

                entity.Property(e => e.Email)
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(45)
                    .HasColumnName("first_name");

                entity.Property(e => e.IsApproved)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_approved");

                entity.Property(e => e.IsRejected)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_rejected");

                entity.Property(e => e.LastName)
                    .HasMaxLength(45)
                    .HasColumnName("last_name");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.Reason)
                    .HasMaxLength(200)
                    .HasColumnName("reason");

                entity.Property(e => e.RejectedBy).HasColumnName("rejected_by");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.ApprovedByNavigation)
                    .WithMany(p => p.UserRequestApprovedByNavigations)
                    .HasForeignKey(d => d.ApprovedBy)
                    .HasConstraintName("user_request_approved_by");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UserRequests)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("user_request_organization_id");

                entity.HasOne(d => d.RejectedByNavigation)
                    .WithMany(p => p.UserRequestRejectedByNavigations)
                    .HasForeignKey(d => d.RejectedBy)
                    .HasConstraintName("user_request_rejected_by");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserRequests)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("user_request_role_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserRequestUsers)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("user_request_user_id");
            });

            modelBuilder.Entity<UsernameLoginStudent>(entity =>
            {
                entity.ToTable("username_login_student");

                entity.HasIndex(e => e.CreatedBy, "username_login_student_created_by_idx");

                entity.HasIndex(e => e.LinkParentId, "username_login_student_link_parent_id_idx");

                entity.HasIndex(e => e.UserId, "username_login_student_user_id_idx");

                entity.Property(e => e.UsernameLoginStudentId).HasColumnName("username_login_student_id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(100)
                    .HasColumnName("created_date");

                entity.Property(e => e.Dob)
                    .HasMaxLength(100)
                    .HasColumnName("dob");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .HasColumnName("first_name");

                entity.Property(e => e.Image)
                    .HasMaxLength(1000)
                    .HasColumnName("image");

                entity.Property(e => e.IsDeleted)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_deleted");

                entity.Property(e => e.IsParent)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_parent");

                entity.Property(e => e.IsShareInfo)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_share_info");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("last_name");

                entity.Property(e => e.LinkParentId).HasColumnName("link_parent_id");

                entity.Property(e => e.Status)
                    .HasMaxLength(100)
                    .HasColumnName("status");

                entity.Property(e => e.StatusId).HasColumnName("status_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("user_name");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.UsernameLoginStudentCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("username_login_student_created_by");

                entity.HasOne(d => d.LinkParent)
                    .WithMany(p => p.UsernameLoginStudentLinkParents)
                    .HasForeignKey(d => d.LinkParentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("username_login_student_link_parent_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UsernameLoginStudentUsers)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("username_login_student_user_id");
            });

            modelBuilder.Entity<UsernameLoginStudentOrganization>(entity =>
            {
                entity.ToTable("username_login_student_organization");

                entity.HasIndex(e => e.UsernameLoginStudentId, "username_login_student_id_idx");

                entity.HasIndex(e => e.OrganizationId, "username_login_student_organization_organization_id_idx");

                entity.Property(e => e.UsernameLoginStudentOrganizationId).HasColumnName("username_login_student_organization_id");

                entity.Property(e => e.OrganizationId).HasColumnName("organization_id");

                entity.Property(e => e.UsernameLoginStudentId).HasColumnName("username_login_student_id");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.UsernameLoginStudentOrganizations)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("username_login_student_organization_organization_id");

                entity.HasOne(d => d.UsernameLoginStudent)
                    .WithMany(p => p.UsernameLoginStudentOrganizations)
                    .HasForeignKey(d => d.UsernameLoginStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("username_login_student_id");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
