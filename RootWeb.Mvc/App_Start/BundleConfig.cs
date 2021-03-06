﻿using System.Web.Optimization;

namespace RootWeb.Mvc
{
    public static class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/scripts/jquery-{version}.js",
                "~/scripts/other/jquery.autosize.js",
                "~/scripts/other/jquery.placeholder.js",
                "~/scripts/other/fixed-scroll.js",
                "~/scripts/other/unobtrusive-data.js",
                "~/scripts/other/slider.js",
                "~/scripts/knockout-{version}.js",
                "~/scripts/knockout.validation*",
                "~/scripts/other/knockout.binding-handlers.js",
                "~/scripts/sammy/sammy.js",
                "~/scripts/sammy/sammy.title*",
                "~/models/LayoutNav.js"
            ));

            bundles.Add(new StyleBundle("~/styles/css").Include(
                "~/styles/reset.css",
                "~/styles/layout.css",
                "~/styles/forms.css",
                "~/styles/contact.css"
            ));

            bundles.Add(new StyleBundle("~/styles/legacy").Include(
                "~/styles/ie8/forms.css"
            ));

            bundles.Add(new StyleBundle("~/content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}