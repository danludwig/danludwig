

var MvcJs = {
	
	Contact: {
		Index: function() {
			var url = "/contact";

			return url.replace(/([?&]+$)/g, "");
		},
		Post: function(model) {
			var url = "/contact/post?model={model}";
			
			if (model) {
				url = url.replace("{model}", model);
			} else {
				url = url.replace("model={model}", "").replace("?&","?").replace("&&","&");
			}

			return url.replace(/([?&]+$)/g, "");
		},
		NameConst: "Contact"
	},
	Home: {
		Index: function() {
			var url = "/";

			return url.replace(/([?&]+$)/g, "");
		},
		NameConst: "Home"
	},
	LinkedN: {
		Index: function() {
			var url = "/linkedn";

			return url.replace(/([?&]+$)/g, "");
		},
		NameConst: "LinkedN"
	},
	Shared: {

	}};






