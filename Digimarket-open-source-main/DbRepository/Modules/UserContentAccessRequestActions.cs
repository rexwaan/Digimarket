using DbRepository.Models;
using DbRepository.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Thirdparty.Helper;

namespace DbRepository.Modules
{
	public class UserContentAccessRequestActions : GenericRepository<UserContentAccessRequest>
	{
		private readonly UserOrganizationEmailActions userOrganizationEmailActions;
		private readonly SpecificUserPrmissionActions specificUserPrmissionActions;
		private readonly UserContentSharingPermissionsActions userContentSharingPermissionsActions;
		private readonly UserActions userActions;

		public UserContentAccessRequestActions(digimarket_devContext db, UserOrganizationEmailActions userOrganizationEmailActions, SpecificUserPrmissionActions specificUserPrmissionActions, UserActions userActions, UserContentSharingPermissionsActions userContentSharingPermissionsActions) : base(db)
		{
			this.userOrganizationEmailActions = userOrganizationEmailActions;
			this.specificUserPrmissionActions = specificUserPrmissionActions;
			this.userActions = userActions;
			this.userContentSharingPermissionsActions = userContentSharingPermissionsActions;
		}
		public override IQueryable<UserContentAccessRequest> GetAll()
		{
			return ctx.UserContentAccessRequests;
		}

		public override async Task<UserContentAccessRequest> Get(int? id)
		{
			id ??= 0;
			return await ctx.UserContentAccessRequests
				.FindAsync(id);
		}
		public async Task<(string msg, bool isSuccess, int requestId)> AddRequest(int? userId, int contentId, string email, string name, int? organizationId)
		{
			var req = await GetAll().Where(x => ((userId.HasValue && x.RequestBy == userId) || x.Email == email) && x.ContentId == contentId).Include(x => x.Content).ThenInclude(x => x.SpecificUserPrmissions).FirstOrDefaultAsync();
			if (req != null)
			{
				if (userId.HasValue)
				{
					if (req.RequestBy.HasValue && req.Approved.ConvertToBool() == true)
					{
						if (UserHasAlreadyAccess(req))
						{
							return ("User already has access to this lesson!", false, 0);
						}
					}
				}
				else
				{
					if (req.Approved.ConvertToBool() == true)
					{
						if (EmailHasAlreadyAccess(req))
						{
							return ("Email already has access to this lesson!", false, 0);
						}
					}
				}
			}
			if (!userId.HasValue)
			{
				// if email is linked to any user
				userId = (await userOrganizationEmailActions.GetAll().Where(x => x.Email == email).FirstOrDefaultAsync())?.UserId;
			}

			UserContentAccessRequest userContentAccessRequest = new UserContentAccessRequest()
			{
				ContentId = contentId,
				Email = email,
				Name = name,
				RequestBy = userId,
				RequestedDate = DateTime.UtcNow.ConvertToString()
			};
			await AddAsync(userContentAccessRequest);
			return ("Request added successfully!", true, userContentAccessRequest.UserContentAccessRequestId);

		}
		public async Task<(string msg, bool isSuccess, UserContentAccessRequest requestData, string token)> ApproveRequest(int requestId)
		{
			var req = await GetAll().Where(x => x.UserContentAccessRequestId == requestId)
				.Include(x => x.Content).ThenInclude(x => x.SpecificUserPrmissions)
				.FirstOrDefaultAsync();
			if (req != null)
			{
				if (req.RequestBy.HasValue)
				{

					if (UserHasAlreadyAccess(req))
					{
						return ("User already has access to this lesson!", false, null, string.Empty);
					}
				}
				else
				{
					if (EmailHasAlreadyAccess(req))
					{
						return ("Email already has access to this lesson!", false, null, string.Empty);
					}
				}
				// approve request
				req.Approved = 1;
				req.ApprovedDate = DateTime.UtcNow.ConvertToString();
				await UpdateAsync(req);
				// add in in SpecificUserPrmissions
				var token = Guid.NewGuid().ToString();
				SpecificUserPrmission specificUserPrmission = new SpecificUserPrmission()
				{
					ContentId = req.ContentId,
					Email = req.Email,
					Name = req.Name,
					IsRequested = 1,
					RequestBy = req.RequestBy,
					Token = token,
				};
				await specificUserPrmissionActions.AddAsync(specificUserPrmission);
				return ("Request has been approved!", true, req,token);

			}
			return ("Request not found!", false, null, string.Empty);

		}
		private bool UserHasAlreadyAccess(UserContentAccessRequest req)
		{

			return req.Content.SpecificUserPrmissions.Any(x => x.ContentId == req.ContentId && x.RequestBy == req.RequestBy);

		}
		private bool EmailHasAlreadyAccess(UserContentAccessRequest req)
		{
			return req.Content.SpecificUserPrmissions.Any(x => x.ContentId == req.ContentId && x.Email == req.Email);
		}
	}
}
