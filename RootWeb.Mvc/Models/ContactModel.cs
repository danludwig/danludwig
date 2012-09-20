using System.Web;
using FluentValidation;
using Recaptcha.MvcModel;

namespace RootWeb.Mvc.Models
{
    public class ContactModel
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Challenge { get; set; }
        public string Response { get; set; }
    }

    public class ContactModelValidator : AbstractValidator<ContactModel>
    {
        private string _recaptchaErrorMessage;

        public ContactModelValidator()
        {
            RuleFor(m => m.Email).NotEmpty().EmailAddress();

            RuleFor(m => m.Response)
                .NotEmpty()
                .WithMessage("Recaptcha cannot be empty.")
                .Must((model, value) =>
                {
                    var recaptchaModel = new RecaptchaValidationModel
                                             {
                        recaptcha_challenge_field = model.Challenge,
                        recaptcha_response_field = model.Response,
                    };
                    var response = RecaptchaValidationModel.IsValid(recaptchaModel, HttpContext.Current.Request.UserHostAddress);
                    _recaptchaErrorMessage = response.ErrorMessage;
                    return response.IsValid;
                })
                .WithMessage("{0}", model => _recaptchaErrorMessage)
            ;
        }
    }
}