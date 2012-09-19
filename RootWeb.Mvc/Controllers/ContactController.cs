using System.Web.Mvc;
using RootWeb.Mvc.Models;

namespace RootWeb.Mvc.Controllers
{
    public partial class ContactController : Controller
    {
        public virtual ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public virtual JsonResult Post(ContactModel model)
        {
            var valid = ModelState.IsValid;
            return Json("worked");
        }
    }
}
