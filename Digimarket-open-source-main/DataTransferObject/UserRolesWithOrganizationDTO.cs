using System;
using System.Collections.Generic;
using System.Text;

namespace DataTransferObject
{
	public class UserRolesWithOrganizationDTO
	{
		public List<string> roles { get; set; }
		public int organizationId { get; set; }
	}
}
