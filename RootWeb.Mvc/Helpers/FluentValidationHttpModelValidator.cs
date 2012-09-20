using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;
using FluentValidation;
using FluentValidation.Internal;
using FluentValidation.Mvc;
using FluentValidation.Results;

namespace RootWeb.Mvc.Helpers
{
    public class FluentValidationHttpModelValidator : ModelValidator
    {
        private readonly IValidator _validator;
        private readonly CustomizeValidatorAttribute _customizations;

        public FluentValidationHttpModelValidator(
            //ModelMetadata metadata,
            IEnumerable<ModelValidatorProvider> validatorProviders, IValidator validator)
            :base(validatorProviders)
        {
            _validator = validator;
            _customizations = new CustomizeValidatorAttribute();
        }

        public override IEnumerable<ModelValidationResult> Validate(ModelMetadata metadata, object container)
        {
            if (metadata.Model != null)
            {
                var selector = _customizations.ToValidatorSelector();
                //var interceptor = _customizations.GetInterceptor() ?? (_validator as IValidatorInterceptor);
                var context = new ValidationContext(metadata.Model, new PropertyChain(), selector);

                //if (interceptor != null)
                //{
                //    // Allow the user to provide a customized context
                //    // However, if they return null then just use the original context.
                //    context = interceptor.BeforeMvcValidation(ControllerContext, context) ?? context;
                //}

                var result = _validator.Validate(context);

                //if (interceptor != null)
                //{
                //    // allow the user to provice a custom collection of failures, which could be empty.
                //    // However, if they return null then use the original collection of failures.
                //    result = interceptor.AfterMvcValidation(ControllerContext, context, result) ?? result;
                //}

                if (!result.IsValid)
                {
                    return ConvertValidationResultToModelValidationResults(result);
                }
            }
            return Enumerable.Empty<ModelValidationResult>();
        }

        protected virtual IEnumerable<ModelValidationResult> ConvertValidationResultToModelValidationResults(ValidationResult result)
        {
            return result.Errors.Select(x => new ModelValidationResult
            {
                MemberName = x.PropertyName,
                Message = x.ErrorMessage
            });
        }
    }
}