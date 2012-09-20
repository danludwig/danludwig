using System;
using System.Collections.Generic;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;
using FluentValidation;
using FluentValidation.Internal;
using FluentValidation.Validators;

namespace RootWeb.Mvc.Helpers
{
    public class FluentValidationHttpPropertyValidator : ModelValidator
    {
        public IPropertyValidator Validator { get; private set; }

        public PropertyRule Rule { get; private set; }

        protected bool ShouldValidate { get; set; }

        public FluentValidationHttpPropertyValidator(ModelMetadata metadata, IEnumerable<ModelValidatorProvider> validatorProviders, PropertyRule rule, IPropertyValidator validator)
            : base(validatorProviders)
        {
            Validator = validator;
            Rule = new PropertyRule(null, x => metadata.Model, null, null, metadata.ModelType, null)
            {
                PropertyName = metadata.PropertyName,
                DisplayName = rule == null ? null : rule.DisplayName,
                RuleSet = rule == null ? null : rule.RuleSet
            };
        }

        protected bool TypeAllowsNullValue(Type type)
        {
            if (type.IsValueType)
                return Nullable.GetUnderlyingType(type) != null;
            return true;
        }

        public override IEnumerable<ModelValidationResult> Validate(ModelMetadata metadata, object container)
        {
            if (ShouldValidate)
            {
                var fakeRule = new PropertyRule(null, x => metadata.Model, null, null, metadata.ModelType, null)
                {
                    PropertyName = metadata.PropertyName,
                    DisplayName = Rule == null ? null : Rule.DisplayName,
                };

                var fakeParentContext = new ValidationContext(container);
                var context = new PropertyValidatorContext(fakeParentContext, fakeRule, metadata.PropertyName);
                var result = Validator.Validate(context);

                foreach (var failure in result)
                {
                    yield return new ModelValidationResult { Message = failure.ErrorMessage };
                }
            }
        }
    }
}