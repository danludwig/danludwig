using System;
using System.Web.Mvc;
using FluentValidation.Mvc;
using RootWeb.Mvc.Helpers;

namespace RootWeb.Mvc
{
    public static class ValidationConfig
    {
        public static void RegisterValidation()
        {
            // register the fluent validation validator factory
            FluentValidationModelValidatorProvider.Configure(
                provider =>
                {
                    provider.ValidatorFactory = new FluentValidatorFactory(DependencyResolver.Current.GetService<IServiceProvider>());
                    provider.AddImplicitRequiredValidator = false;
                }
            );
        }
    }
}