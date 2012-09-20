using System.Web.Mvc;

namespace RootWeb.Mvc.Controllers
{
    public partial class ContactController : Controller
    {
        public virtual ActionResult Index()
        {
            return View();
        }
    }
}
