using Core.Helper;
using DataTransferObject;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DbRepository.Modules
{
    public class UserActions : GenericRepository<User>
    {
        private readonly UserOrganizationRoleActions userOrganizationRoleActions;
        private readonly UserOrganizationActions userOrganizationActions;

        public UserActions(digimarket_devContext db, UserOrganizationRoleActions userOrganizationRoleActions, UserOrganizationActions userOrganizationActions) : base(db)
        {
            this.userOrganizationRoleActions = userOrganizationRoleActions;
            this.userOrganizationActions = userOrganizationActions;
        }
        public override IQueryable<User> GetAll()
        {
           
            return ctx.Users;
        }
        public async Task<User> GetByEmail(string email)
        {
            return await ctx.Users.FirstOrDefaultAsync(x => x.UserOrganizationEmails.Any(n => n.Email == email));
        }
        public async Task<User> GetUser(string email, string password)
        {
            return await ctx.Users.FirstOrDefaultAsync(x => x.UserOrganizationEmails.Any(n => n.Email == email && x.UserId == n.UserId) && x.Password == password);
        }
        public override async Task<User> Get(int? id)
        {
            id ??= 0;
            return await ctx.Users
                .FindAsync(id);
        }
        public async Task<bool> IsExist(int id)
        {
            var res = await Get(id);
            return res != null;
        }
        public async Task<string> GetFullName(int? id)
        {
            var user = await Get(id);
            if (user == null)
            {
                return null;
            }
            return $"{user.Firstname} {user.Lastname}";
        }

        public void GetEmailAgainstOrganization(int userId, int organizationId)
        {

        }
        //public async Task<List<string>> GetUserRolesByOrganization(int userId, int organizationId)
        //{
        //    // get userOrganization to get roles
        //    var userOrganization = await userOrganizationActions.GetAll().Where(x => x.UserId == userId && x.OrganizationId == organizationId && x.IsActive != 0).FirstOrDefaultAsync();
        //    var roles = await userOrganizationRoleActions.GetRolesByUser(userOrganization.UserOrganizationId);
        //    return roles;
        //}
        public async Task<List<UserRolesWithOrganizationDTO>> GetUserRolesInAllOrganizations(int? userId)
        {
            List<UserRolesWithOrganizationDTO> roles = new List<UserRolesWithOrganizationDTO>();
            if (userId.HasValue)
            {
                var userOrganizations = await userOrganizationActions.GetAll().Where(x => x.UserId == userId && x.IsActive != 0).ToListAsync();
                foreach (var userOrganization in userOrganizations)
                {
                    roles.Add(new UserRolesWithOrganizationDTO()
                    {
                        organizationId = userOrganization.OrganizationId,
                        roles = await userOrganizationRoleActions.GetRolesByUser(userOrganization.UserOrganizationId)
                    });
                }
            }
            return roles;
        }
        //public async Task<List<string>> isStudentInSameOrganization(int userId, int organizationId)
        //{
        //    return await GetUserRolesByOrganization(userId, organizationId);            
        //}
        //public async Task<List<UserRolesWithOrganizationDTO>> isStudentInAnyOrganization(int userId)
        //{
        //    return await GetUserRolesInAllOrganizations(userId);
        //}
    }
}
