

var MvcJs = {
	
	Contact: {
		Index: function() {
			var url = "/contact";

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






