using System.Web;
using FluentValidation;
using RootWeb.Mvc.Helpers;

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
        public ContactModelValidator()
        {
            RuleFor(m => m.Email).NotEmpty().EmailAddress();

            RuleFor(m => m.Response)
                .NotEmpty()
                .WithMessage("Recaptcha cannot be empty.")
                .Must((model, value) =>
                {
                    var http = new HttpContextWrapper(HttpContext.Current);
                    var recaptchaValidated = http.Session.RecaptchaValidated();
                    if (recaptchaValidated != null)
                    {
                        return recaptchaValidated.Challenge == model.Challenge
                               && recaptchaValidated.Response == model.Response
                               && recaptchaValidated.AnonymousId == http.Request.AnonymousID;
                    }
                    return false;
                })
                .WithMessage("Recaptcha verification has failed.")
            ;
        }
    }
}