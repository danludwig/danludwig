using System.Linq;
using System.Web.Mvc;
using Recaptcha.MvcModel;
using RootWeb.Mvc.Helpers;

namespace RootWeb.Mvc.Controllers
{
    public partial class RecaptchaController : Controller
    {
        [HttpPost]
        public virtual JsonResult Index(RecaptchaValidationModel model)
        {
            //System.Threading.Thread.Sleep(5000);
            if (!ModelState.IsValid)
                return Json(ModelState.First(s => s.Value.Errors.Any()).Value.Errors.First().ErrorMessage);

            Session.RecaptchaValidated(model, Request.AnonymousID);
            return Json(true);
        }
    }
}
