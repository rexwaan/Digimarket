using Core.Helper;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace DbRepository.Modules
{
    public class RolePermissionActions : GenericRepository<RolePermission>
    {
        private readonly PermissionActions permissionActions;
        public RolePermissionActions(digimarket_devContext db, PermissionActions permissionActions) : base(db)
        {
            this.permissionActions = permissionActions;
        }
        public override IQueryable<RolePermission> GetAll()
        {
            return ctx.RolePermissions;
        }


        public override async Task<RolePermission> Get(int? id)
        {
            id ??= 0;
            return await ctx.RolePermissions
                .FindAsync(id);
        }
        public async Task<List<Permission>> GetPermissionsByRoles(List<int> roleIds)
        {
            return await GetAll().Where(x => roleIds.Contains(x.RoleId)).Select(x => x.Permission).ToListAsync();
        }
        public async Task<List<int>> GetPermissionsByOrganization(int permissionId, int organizationId)
        {
            return await GetAll().Where(x => x.PermissionId == permissionId
            && x.Role.OrganizationId == organizationId
            ).Select(x => x.RoleId).ToListAsync();
        }

        public async Task AssignPermissionsToRole(int roleId, RoleType roleType, int userId)
        {
            List<Permission> permissions = new List<Permission>();
            if (roleType == RoleType.Owner)
            {
                permissions = await permissionActions.GetAll().ToListAsync();
            }
            else if (roleType == RoleType.Admin)
            {
                var permissionList = new List<string>(){
                    Permissions.view_of_team_information.GetDescription(),
                    Permissions.approve_requests_to_join_the_workspace.GetDescription(),
                    Permissions.lessons_creation.GetDescription(),
                    Permissions.lessons_sharing.GetDescription(),
                    Permissions.change_or_add_type_to_a_user.GetDescription(),
                    Permissions.create_courses_types.GetDescription(),
                    Permissions.create_a_userName_user_as_an_admin.GetDescription(),
                    Permissions.invite_users_to_join.GetDescription(),
                    Permissions.manage_lessons_scheduling_and_assign_students_to_classes.GetDescription(),
                    Permissions.get_email_notification_for_contact_us_form_submission.GetDescription(),
                    Permissions.have_access_to_contact_us_log.GetDescription(),
                    Permissions.deliver_class_as_a_teacher.GetDescription(),
                    Permissions.Deactivate_activate_accounts.GetDescription(),
                    Permissions.Lesson_schedule_view_additional_participants.GetDescription(),
                };
                permissions = await permissionActions.GetAll().Where(x => permissionList.Contains(x.Name)).ToListAsync();
            }
            else if (roleType == RoleType.Parent)
            {
                var permissionList = new List<string>(){
                    Permissions.create_and_approve_a_userName_user_as_a_parent.GetDescription(),
                    Permissions.Lesson_schedule_view_additional_participants.GetDescription(),
                    Permissions.Lesson_schedule_view_parent.GetDescription(),
                };
                permissions = await permissionActions.GetAll().Where(x => permissionList.Contains(x.Name)).ToListAsync();
            }
            else if (roleType == RoleType.Teacher)
            {
                var permissionList = new List<string>(){
                    Permissions.lessons_creation.GetDescription(),
                    Permissions.lessons_sharing.GetDescription(),
                    Permissions.deliver_class_as_a_teacher.GetDescription(),
                    Permissions.Lesson_schedule_view_additional_participants.GetDescription(),
                    Permissions.Lesson_schedule_view_teacher.GetDescription(),
                };
                permissions = await permissionActions.GetAll().Where(x => permissionList.Contains(x.Name)).ToListAsync();
            }
            else if (roleType == RoleType.Student ||roleType == RoleType.UsernameLoginStudent)
            {
                var permissionList = new List<string>(){                   
                    Permissions.Lesson_schedule_view_student.GetDescription(),
                };
                permissions = await permissionActions.GetAll().Where(x => permissionList.Contains(x.Name)).ToListAsync();
            }
            if (permissions.Count > 0)
            {
                List<RolePermission> rolePermissionsList = new List<RolePermission>();
                permissions.ForEach(permission =>
                {
                    rolePermissionsList.Add(new RolePermission()
                    {
                        RoleId = roleId,
                        PermissionId = permission.PermissionId,
                        CreatedBy = userId,
                        CreatedDate = DateTime.UtcNow.ToString(),
                    });
                });
                await AddRangeAsync(rolePermissionsList);
            }
        }

    }
}
