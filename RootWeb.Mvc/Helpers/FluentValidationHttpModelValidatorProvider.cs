using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;

namespace RootWeb.Mvc.Helpers
{
    public class FluentValidationHttpModelValidatorProvider : ModelValidatorProvider
    {
        public override IEnumerable<ModelValidator> GetValidators(ModelMetadata metadata, IEnumerable<ModelValidatorProvider> validatorProviders)
        {
            var factory = new FluentValidatorFactory((IServiceProvider)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(IServiceProvider)));
            var validator = new FluentValidationHttpModelValidator(validatorProviders, factory);
            return new[] { validator };
        }
    }
}