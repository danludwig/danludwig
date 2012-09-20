namespace RootWeb.Mvc.Models
{
    public class RecaptchaModelValidated
    {
        public string Challenge { get; set; }
        public string Response { get; set; }
        public string AnonymousId { get; set; }
    }
}