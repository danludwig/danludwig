using System.Linq;
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

            return Json(true);
        }
    }
}
