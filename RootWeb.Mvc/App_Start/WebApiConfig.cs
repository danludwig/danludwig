﻿using System;
using System.Web.Http;
using System.Web.Http.Validation;
using Newtonsoft.Json.Serialization;
using RootWeb.Mvc.Helpers;

namespace RootWeb.Mvc
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // set up fluent validation for http model validation
            var serviceProvider = (IServiceProvider) config.DependencyResolver.GetService(typeof (IServiceProvider));
            var validatorFactory = new FluentValidatorFactory(serviceProvider);
            config.Services.Insert(typeof(ModelValidatorProvider), 0, new FluentValidationHttpModelValidatorProvider(validatorFactory));

            // convert pascalcased properties to camel case
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // default api route
            config.Routes.MapHttpRoute(null,
                "api/{controller}/{id}",
                new
                {
                    id = RouteParameter.Optional
                });
        }
    }
}
