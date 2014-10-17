

var Review = Backbone.Model.extend({
	initialize: function() {
		console.log("New Review instatiated.");
	},
	defaults: {
		title: "Name of thing",
		genre: "None"
	}
});

var temp = new Review();