using System.Web;
using FluentValidation;
using Recaptcha.MvcModel;

namespace RootWeb.Mvc.Models
{
    public class RecaptchaModelValidator : AbstractValidator<RecaptchaValidationModel>
    {
        private string _recaptchaErrorMessage;

        public RecaptchaModelValidator()
        {
            RuleFor(m => m.recaptcha_response_field).NotEmpty().WithMessage("Recaptcha cannot be empty.")
                .Must((model, value) =>
                {
                    var response = RecaptchaValidationModel.IsValid(model, HttpContext.Current.Request.UserHostAddress);
                    _recaptchaErrorMessage = response.ErrorMessage;
                    return response.IsValid;
                })
                .WithMessage("{0}", model => _recaptchaErrorMessage)
            ;
        }
    }
}