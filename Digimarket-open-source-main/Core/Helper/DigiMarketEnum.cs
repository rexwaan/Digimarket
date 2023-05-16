using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Core.Helper
{
    public enum OrganizationType
    {
        [Description("Educational")]
        Educational = 1,

    }
    public enum MetaType
    {
        Property = 1,
        Resource = 2,

    }
    public enum RequestStatus
    {
        Approved = 1,
        Rejected = 2,

    }
    public enum RoleType
    {
        [Description("This role has all the privileges for this organization")]
        Owner = 1,
        [Description("This role has Admin privileges for this organization")]
        Admin = 2,
        [Description("This role has Parent privileges for this organization")]
        Parent = 3,
        [Description("This role has Teacher privileges for this organization")]
        Teacher = 4,
        [Description("This role has Student privileges for this organization")]
        Student = 5,
        [Description("This role has Username login Student privileges for this organization")]
        UsernameLoginStudent = 6,

    }
    public enum Permissions
    {
        [Description("deliver_class_as_a_teacher")]
		deliver_class_as_a_teacher,
        [Description("get_email_notification_for_contact_us_form_submission")]
		get_email_notification_for_contact_us_form_submission,
        [Description("view_of_team_information")]
        view_of_team_information,
        [Description("edit_all_curriculum_owned_by_the_organization")]
        edit_all_curriculum_owned_by_the_organization,
        [Description("define_or_create_user_types_for_the_organizat")]
        define_or_create_user_types_for_the_organizat,
        [Description("change_or_add_type_to_a_user")]
        change_or_add_type_to_a_user,
        [Description("approve_requests_to_join_the_workspace")]
        approve_requests_to_join_the_workspace,
        [Description("lessons_creation")]
        lessons_creation,
        [Description("lessons_sharing")]
        lessons_sharing,
        [Description("assignee_a_user_to_becoming_an_owner_or_co_ow")]
        assignee_a_user_to_becoming_an_owner_or_co_ow,
        [Description("manage_lessons_scheduling_and_assign_students_to_classes")]
        manage_lessons_scheduling_and_assign_students_to_classes,
        [Description("create_courses_types")]
        create_courses_types,
        [Description("invite_users_to_join")]
        invite_users_to_join,
        [Description("create_and_approve_a_userName_user_as_a_parent")]
        create_and_approve_a_userName_user_as_a_parent,
        [Description("create_a_userName_user_as_an_admin")]
        create_a_userName_user_as_an_admin,
        [Description("approve_sharing_of_student_information")]
        approve_sharing_of_student_information,
        [Description("access_to_edit_the_workspace_page")]
        access_to_edit_the_workspace_page,
        [Description("have_access_to_contact_us_log")]
        have_access_to_contact_us_log,
        [Description("Deactivate_activate_accounts")]
        Deactivate_activate_accounts,
        [Description("Delete_the_organization")]
        Delete_the_organization,
        [Description("Lesson_schedule_view_teacher")]
        Lesson_schedule_view_teacher,
        [Description("Lesson_schedule_view_parent")]
        Lesson_schedule_view_parent,
        [Description("Lesson_schedule_view_student")]
        Lesson_schedule_view_student,
        [Description("Lesson_schedule_view_additional_participants")]
        Lesson_schedule_view_additional_participants,




	}
    public enum MemberType
    {
        Participants = 1,
        Team = 2,
    }
    public enum Status
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,
    }
    public enum AddRemoveStatus
    {
        Add = 1,
        Remove = 2,
    }
    public enum UserContentMetaEnum
    {
        [Description("Main Topic")]
        Topic,
        [Description("Keywords")]
        Keywords,
        [Description("Language")]
        Language,
        [Description("Target Audience Minimal Age")]
        MinAge,
        [Description("Target Audience Maximal Age")]
        MaxAge,
    }
}
