using System.Collections.Generic;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;
using FluentValidation.Internal;
using FluentValidation.Validators;

namespace RootWeb.Mvc.Helpers
{
    public delegate ModelValidator FluentValidationHttpModelValidationFactory(ModelMetadata metadata, 
        IEnumerable<ModelValidatorProvider> validatorProviders, PropertyRule rule, IPropertyValidator validator);
}