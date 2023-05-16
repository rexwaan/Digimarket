using Core.Helper;
using DigiMarketWebApi.Controllers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DbRepository.Repository;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Linq;
using DbRepository.Models;
using Microsoft.EntityFrameworkCore;
using Thirdparty.Helper;
using Thirdparty.Mail;
using Thirdparty.AWS;

namespace DigiMarketWebApi.Helper
{
    public static class ServiceInstallerExtenssion
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration Configuration)
        {
            services.Configure<Appsettings>(Configuration.GetSection("AppSettings"));
            services.AddTransient<IMailRepo, MailRepo>();
            services.AddTransient<IAWSService, AWSService>();
            services.AddCors();
            services.AddControllers();
            var connectionString = Configuration.GetConnectionString("defaultconnection");
            //    services.AddDbContextPool <digimarket_stagingContext> (
            //options => options.UseMySql(connectionString));
            services.AddDbContext<digimarket_devContext>(options =>
            options.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.31-mysql")));

            // swagger
            services.AddSwaggerGen();
            services.RegisterModulesActions();



            return services;

        }
        public static IServiceCollection RegisterModulesActions(this IServiceCollection serviceDescriptors)
        {
            var allActionsTypes = typeof(GenericRepository<>)
                .Assembly.GetExportedTypes()
                .Where(x => x.IsPublic && x.IsSubclassOfRawGeneric(typeof(GenericRepository<>)));

            foreach (var t in allActionsTypes)
            {
                serviceDescriptors.TryAddScoped(t);
            }
            return serviceDescriptors;
        }

        /// <summary>
        /// Alternative version of <see cref="Type.IsSubclassOf"/> that supports raw generic types (generic types without
        /// any type parameters).
        /// </summary>
        /// <param name="baseType">The base type class for which the check is made.</param>
        /// <param name="toCheck">To type to determine for whether it derives from <paramref name="baseType"/>.</param>
        public static bool IsSubclassOfRawGeneric(this Type toCheck, Type baseType)
        {

            while (toCheck.BaseType != null && toCheck != typeof(object))
            {
                Type cur = toCheck.IsGenericType ? toCheck.GetGenericTypeDefinition() : toCheck;
                if (baseType == cur)
                {
                    return true;
                }

                toCheck = toCheck.BaseType;
            }

            return false;
        }

    }
}
