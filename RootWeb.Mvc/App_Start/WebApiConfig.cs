using System.Web.Http;

namespace RootWeb.Mvc
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(null,
                "api/{controller}/{id}",
                new
                {
                    id = RouteParameter.Optional
                });
        }
    }
}
