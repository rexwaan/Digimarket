using DbRepository.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DigiMarketWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using DbRepository.Modules;
using System.Threading.Tasks;

namespace DigiMarketWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        //private readonly digimarket_devContext _context;
        private readonly CourseLocationActions courseLocationActions;

        public LocationController(CourseLocationActions courseLocationActions)
        {
            this.courseLocationActions = courseLocationActions;
        }
        [HttpGet]
        [Route("GetLocations")]
        public dynamic GetLocationss(int organizationId)
        {
            var locations = courseLocationActions.GetAll().Where(x => x.OrganizationId == organizationId).Select(x => new LocationDTO()
            {
                courseLocationId = x.CourseLocationId,
                location = x.Location,
                details = x.Details,
                organizationId = organizationId,
                createdBy = x.CreatedBy,
            }).ToList();
            if (locations != null)
            {
                return StatusCode(200, new
                {
                    statusCode = 200,
                    result = locations,
                    message = $"{locations.Count} location(s) found"
                });
            }
            else
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = "",
                    message = "locations not Found against the given organization!"
                });
            }
        }
        [HttpPost]
        [Route("AddLocation")]
        public async Task<dynamic> AddCourseAsync(LocationDTO locationDTO)
        {
            var location = await courseLocationActions.Get(locationDTO.courseLocationId);
            if (location == null)
            {
                var locationObj = new CourseLocation()
                {
                    Location = locationDTO.location,
                    Details = locationDTO.details,
                    OrganizationId = locationDTO.organizationId,
                    CreatedBy = locationDTO.createdBy,
                    CreatedDate=DateTime.UtcNow.ToString(),
                };
                await courseLocationActions.AddAsync(locationObj);
            }
            else
            {
                location.Location = locationDTO.location;
                location.Details = locationDTO.details;
                await courseLocationActions.UpdateAsync(location);
            }

            return StatusCode(200, new
            {
                statusCode = 200,
                result = string.Empty,
                message = "Location Created/Updated!"
            });

        }
        [HttpDelete]
        [Route("DeleteLocation")]
        public async Task<dynamic> DeleteLocationAsync(int locationId)
        {
            var location = await courseLocationActions.Get(locationId);
            if (location == null)
            {
                return StatusCode(404, new
                {
                    statusCode = 404,
                    result = string.Empty,
                    message = "Location not Found!"
                });
            }

            await courseLocationActions.RemoveAsync(location);
            return StatusCode(200, new
            {
                statusCode = 200,
                result = string.Empty,
                message = "Location Deleted!"
            });

        }

    }
}
