﻿//using System;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using RootWeb.Mvc.Models;

//namespace RootWeb.Mvc.ApiControllers
//{
//    public class ContactController : ApiController
//    {
//        // POST api/contact
//        public HttpResponseMessage Post([FromBody] ContactModel model)
//        {
//            if (!ModelState.IsValid)
//                return new HttpResponseMessage(HttpStatusCode.BadRequest)
//                {
//                    ReasonPhrase = ModelState.First(s => s.Value.Errors.Any()).Value.Errors.First().ErrorMessage,
//                };

//            var response = new HttpResponseMessage(HttpStatusCode.OK);
//            response.Headers.Location = new Uri(Url.Link(null, new { id = Guid.NewGuid() }));
//            return response;
//        }
//    }
//}
