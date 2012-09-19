using System.Web.Http;

namespace RootWeb.Mvc.ApiControllers
{
    public class ContactController : ApiController
    {
        //// GET api/contact
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/contact/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/contact
        public void Post([FromBody] ContactModel model)
        {
        }

        //// PUT api/contact/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/contact/5
        //public void Delete(int id)
        //{
        //}
    }

    public class ContactModel
    {
        public string Email { get; set; }
        public string Subject { get; set; }
    }
}
