using System.Web.Mvc;

namespace RootWeb.Mvc.Controllers
{
    public partial class HomeController : Controller
    {
        public virtual ActionResult Index()
        {
            return View();
        }
    }
}
