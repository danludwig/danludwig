using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Metadata;
using System.Web.Http.Validation;
using FluentValidation;
using FluentValidation.Attributes;
using FluentValidation.Internal;
using FluentValidation.Validators;

namespace RootWeb.Mvc.Helpers
{
    public class FluentValidationHttpModelValidatorProvider : ModelValidatorProvider
    {
        public IValidatorFactory ValidatorFactory { get; set; }

        public FluentValidationHttpModelValidatorProvider(IValidatorFactory validatorFactory = null)
        {
            ValidatorFactory = validatorFactory ?? new AttributedValidatorFactory();
        }

        public override IEnumerable<ModelValidator> GetValidators(ModelMetadata metadata, IEnumerable<ModelValidatorProvider> validatorProviders)
        {
            if (IsValidatingProperty(metadata))
            {
                return GetValidatorsForProperty(metadata, validatorProviders, ValidatorFactory.GetValidator(metadata.ContainerType));
            }
            return GetValidatorsForModel(
                //metadata,
                validatorProviders, ValidatorFactory.GetValidator(metadata.ModelType));
        }

        private IEnumerable<ModelValidator> GetValidatorsForProperty(ModelMetadata metadata, IEnumerable<ModelValidatorProvider> validatorProviders, IValidator validator)
        {
            var modelValidators = new List<ModelValidator>();

            if (validator != null)
            {
                var descriptor = validator.CreateDescriptor();

                var validatorsWithRules = from rule in descriptor.GetRulesForMember(metadata.PropertyName)
                                          let propertyRule = (PropertyRule)rule
                                          let validators = rule.Validators
                                          where validators.Any()
                                          from propertyValidator in validators
                                          let modelValidatorForProperty = GetModelValidator(metadata, validatorProviders, propertyRule, propertyValidator)
                                          where modelValidatorForProperty != null
                                          select modelValidatorForProperty;

                modelValidators.AddRange(validatorsWithRules);
            }

            //if (validator != null && metadata.IsRequired && AddImplicitRequiredValidator)
            //{
            //    bool hasRequiredValidators = modelValidators.Any(x => x.IsRequired);

            //    //If the model is 'Required' then we assume it must have a NotNullValidator.
            //    //This is consistent with the behaviour of the DataAnnotationsModelValidatorProvider
            //    //which silently adds a RequiredAttribute

            //    if (!hasRequiredValidators)
            //    {
            //        modelValidators.Add(CreateNotNullValidatorForProperty(metadata, context));
            //    }
            //}

            return modelValidators;
        }

        private ModelValidator GetModelValidator(ModelMetadata meta, IEnumerable<ModelValidatorProvider> validatorProviders, PropertyRule rule, IPropertyValidator propertyValidator)
        {
            //var type = propertyValidator.GetType();

            FluentValidationHttpModelValidationFactory factory =
                //validatorFactories
                //.Where(x => x.Key.IsAssignableFrom(type))
                //.Select(x => x.Value)
                //.FirstOrDefault()
                //??
                ((metadata, controllerContext, description, validator) => new FluentValidationHttpPropertyValidator(metadata, controllerContext, description, validator));

            return factory(meta, validatorProviders, rule, propertyValidator);
        }

        private IEnumerable<ModelValidator> GetValidatorsForModel(
            //ModelMetadata metadata,
            IEnumerable<ModelValidatorProvider> validatorProviders, IValidator validator)
        {
            if (validator != null)
                yield return new FluentValidationHttpModelValidator(
                    //metadata,
                    validatorProviders, validator);
        }

        private bool IsValidatingProperty(ModelMetadata metadata)
        {
            if (metadata.ContainerType != null)
                return !string.IsNullOrEmpty(metadata.PropertyName);
            return false;
        }
    }
}