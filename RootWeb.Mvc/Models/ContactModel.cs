using FluentValidation;

namespace RootWeb.Mvc.Models
{
    public class ContactModel
    {
        public string Email { get; set; }
        public string Subject { get; set; }
    }

    public class ContactModelValidator : AbstractValidator<ContactModel>
    {
        public ContactModelValidator()
        {
            RuleFor(m => m.Email).NotEmpty().EmailAddress()
                //.Must((o, p) =>
                //{
                //    return p.Length > 100;
                //})
            ;
        }
    }
}