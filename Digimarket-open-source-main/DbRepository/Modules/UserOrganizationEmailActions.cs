using DataTransferObject;
using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace DbRepository.Modules
{
	public class UserOrganizationEmailActions : GenericRepository<UserOrganizationEmail>
	{
		private readonly OrganizationActions organizationActions;

		public UserOrganizationEmailActions(digimarket_devContext db, OrganizationActions organizationActions) : base(db)
		{
			this.organizationActions = organizationActions;
		}
		public override IQueryable<UserOrganizationEmail> GetAll()
		{
			return ctx.UserOrganizationEmails;
		}
		public override async Task<UserOrganizationEmail> Get(int? id)
		{
			id ??= 0;
			return await ctx.UserOrganizationEmails
				.FindAsync(id);
		}
		public async Task<bool> CheckPinAndVerifyEmail(string email, int userId, int organizationId, int pin)
		{

			var res = await GetAll().FirstOrDefaultAsync(x => x.UserId == userId && x.OrganizationId == organizationId && x.Email == email && x.Pin == pin);
			if (res == null)
			{
				return false;
			}
			//var pinGeneratedTime = res.PinGeneratedAt.ConvertToDateTime();
			//if (pinGeneratedTime)
			//{

			//}
			res.IsVerified = 1;
			res.IsNotificationOn = 1;

			await UpdateAsync(res);
			return true;
		}
		public async Task<List<EmailWithUserDTO>> GetEmailsByOrganizationForNotifications(List<int> userIds, int organizationId)
		{
			var res = await GetAll().Where(x => x.OrganizationId == organizationId && userIds.Contains(x.UserId) && x.IsVerified == 1 && x.IsNotificationOn == 1).Include(x => x.User).Select(x => new EmailWithUserDTO { email = x.Email, firstName = x.User.Firstname, lastName = x.User.Lastname, }).ToListAsync();
			return res;
		}
		public async Task<string> GetPrimaryEmailByOrganization(int? userId, int? organizationId)
		{
			if (userId != null && organizationId != null)
			{
				List<int> userids = new List<int>() { (int)userId };
				// get primary email for current organization
				var res = await GetAll().Where(x => x.OrganizationId == (int)organizationId && userids.Contains(x.UserId) && x.IsVerified == 1 && x.IsPrimary == 1).Select(x => x.Email).FirstOrDefaultAsync();
				if (res == null)
				{
					return await GetAll().Where(x => userids.Contains(x.UserId) && x.IsPrimary == 1).Select(x => x.Email).FirstOrDefaultAsync();
				}
				return res;
			}
			return null;

		}
		public async Task<(bool isSuccess, string response)> TurnOnOffNotificationn(int emailId, bool? isNotificationOn)
		{
			var res = await GetAll().FirstOrDefaultAsync(x => x.UserOrganizationEmailId == emailId && x.IsVerified == 1);
			if (res.IsPrimary == 1 && isNotificationOn == false)
			{
				return (false, "Cannot turn off notification of Primary email!");
			}
			if (res == null)
			{
				return (false, "Email not found!");
			}
			res.IsNotificationOn = (ulong)isNotificationOn.ConvertToUlong();
			await UpdateAsync(res);
			return (true, string.Empty);
		}
		public async Task<bool> SetPrimaryEmail(int emailId)
		{
			var res = await GetAll().FirstOrDefaultAsync(x => x.UserOrganizationEmailId == emailId && x.IsVerified == 1);
			if (res == null)
			{
				return false;
			}
			res.IsPrimary = 1;
			res.IsNotificationOn = 1;
			await UpdateAsync(res);
			// set organization email as primary email
			if (res.OrganizationId != null)
			{
				var organization = await organizationActions.Get((int)res.OrganizationId);
				if (organization != null)
				{
					organization.EmailAddress = res.Email;
					await organizationActions.UpdateAsync(organization);
				}
			}

			var otherEmails = await GetAll().Where(x => x.OrganizationId == res.OrganizationId && x.UserId == res.UserId && x.UserOrganizationEmailId != res.UserOrganizationEmailId).ToListAsync();
			foreach (var email in otherEmails)
			{
				email.IsPrimary = 0;
				await UpdateAsync(email);
			}
			return true;
		}
		public async Task<(bool isSuccess, string response)> RemoveEmail(int emailId)
		{
			var email = await Get(emailId);
			if (email == null)
			{
				return (false, "Email not found!");
			}
			if (email.IsPrimary == 1)
			{
				return (false, "Can not remove primary email!");
			}
			await RemoveAsync(email);
			return (true, string.Empty);
		}
	}
}
