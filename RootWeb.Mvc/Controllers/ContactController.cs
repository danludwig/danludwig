using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Web.Mvc;
using RootWeb.Mvc.Models;

namespace RootWeb.Mvc.Controllers
{
    public partial class ContactController : Controller
    {
        [HttpGet]
        public virtual ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public virtual JsonResult Index(ContactModel model)
        {
            if (!ModelState.IsValid)
                return Json(ModelState.First(s => s.Value.Errors.Any()).Value.Errors.First().ErrorMessage);

            var mailMessage = new MailMessage(model.Email, ConfigurationManager.AppSettings["ContactMailToAddress"])
            {
                Subject = !string.IsNullOrWhiteSpace(model.Subject)
                    ? model.Subject : "[No subject]",
                IsBodyHtml = false,
                Body = model.Message,
            };

            using (var smtp = new SmtpClient())
            {
                try
                {
                    //throw new SmtpException(SmtpStatusCode.GeneralFailure, "my custom message");
                    //throw new InvalidOperationException("my custom message");
                    smtp.Send(mailMessage);
                }
                catch (SmtpException ex)
                {
                    if (ex.Message.Contains("5.1.8") && ex.Message.Contains("R0107008"))
                        return Json("domain");
                    return Json("other");
                }
            }

            return Json(true);
        }
    }
}
