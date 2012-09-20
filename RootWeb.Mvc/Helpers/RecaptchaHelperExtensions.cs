using System;
using System.Web;
using Newtonsoft.Json;
using Recaptcha.MvcModel;
using RootWeb.Mvc.Models;

namespace RootWeb.Mvc.Helpers
{
    public static class RecaptchaHelperExtensions
    {
        private const string Key = "RecaptchaValidated";

        public static void RecaptchaValidated(this HttpSessionStateBase session, RecaptchaValidationModel model, string anonymousId)
        {
            if (session == null) throw new ArgumentNullException("session");
            if (model == null) throw new ArgumentNullException("model");
            if (string.IsNullOrWhiteSpace(anonymousId))
                throw new ArgumentException("AnonymousID cannot be null or whitespace. Make sure anonymous identification is enabled.");

            var data = new RecaptchaModelValidated
            {
                Challenge = model.recaptcha_challenge_field,
                Response = model.recaptcha_response_field,
                AnonymousId = anonymousId,
            };
            var raw = JsonConvert.SerializeObject(data);

            if (session[Key] != null) session.Remove(Key);
            session.Add(Key, raw);
        }

        public static RecaptchaModelValidated RecaptchaValidated(this HttpSessionStateBase session)
        {
            if (session == null) throw new ArgumentNullException("session");

            var raw = session[Key] as string;
            var model = JsonConvert.DeserializeObject<RecaptchaModelValidated>(raw);
            return model;
        }
    }
}