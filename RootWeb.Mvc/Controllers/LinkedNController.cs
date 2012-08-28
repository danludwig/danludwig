using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace RootWeb.Mvc.Controllers
{
    public partial class LinkedNController : Controller
    {
        public virtual ActionResult Index()
        {
            return View();
        }
    }
}
