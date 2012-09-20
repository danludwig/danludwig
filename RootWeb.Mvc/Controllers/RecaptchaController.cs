using System.Linq;
using System.Web.Mvc;
using Recaptcha.MvcModel;

namespace RootWeb.Mvc.Controllers
{
    public partial class RecaptchaController : Controller
    {
        [HttpPost]
        public virtual JsonResult Index(RecaptchaValidationModel model)
        {
            object response = true;
            if (!ModelState.IsValid)
                response = ModelState.First(s => s.Value.Errors.Any()).Value.Errors.First().ErrorMessage;
            return Json(response);
        }
    }
}
