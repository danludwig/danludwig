using System.Collections.Generic;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;
using FluentValidation;

namespace RootWeb.Mvc.Helpers
{
    public class FluentValidationHttpModelValidator : ModelValidator
    {
        private readonly IValidatorFactory _validatorFactory;

        public FluentValidationHttpModelValidator(IEnumerable<ModelValidatorProvider> validatorProviders, IValidatorFactory validatorFactory)
            : base(validatorProviders)
        {
            _validatorFactory = validatorFactory;
        }

        public override IEnumerable<ModelValidationResult> Validate(ModelMetadata metadata, object container)
        {
            if (container != null)
            {
                var validator = _validatorFactory.GetValidator(container.GetType());
                var results = validator.Validate(container);
                foreach (var result in results.Errors)
                {
                    yield return new ModelValidationResult
                                     {
                                         MemberName = result.PropertyName,
                                         Message = result.ErrorMessage,
                                     };
                }
            }
        }
    }
}