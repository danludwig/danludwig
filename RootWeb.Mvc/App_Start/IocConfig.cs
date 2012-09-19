using System;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using FluentValidation;
using RootWeb.Mvc.Helpers;
using SimpleInjector;
using SimpleInjector.Extensions;
using SimpleInjector.Integration.Web.Mvc;

namespace RootWeb.Mvc
{
    public static class IocConfig
    {
        /// <summary>Initialize the container and register it as MVC3 Dependency Resolver.</summary>
        public static void RegisterDependencies()
        {
            var container = new Container();

            InitializeContainer(container);

            container.RegisterMvcControllers(Assembly.GetExecutingAssembly());

            container.RegisterMvcAttributeFilterProvider();

            container.Verify();

            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new SimpleInjectorHttpDependencyResolver(container);
        }

        private static void InitializeContainer(Container container)
        {
            container.RegisterSingle<IServiceProvider>(container);
            container.RegisterManyForOpenGeneric(typeof(IValidator<>), Assembly.GetExecutingAssembly());
        }
    }
}