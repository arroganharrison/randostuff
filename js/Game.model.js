app.Game = Backbone.Model.extend({
	initialize: function() {

	},
	defaults: {
		title: "default",
		genre: "default",
		rating: 0,
		numReviews: 0
	}
});

app.GamesList = Backbone.Collection.extend({
	model: app.Game,
	localStorage: new Store("social-games"),
	searchTitle: function(partial) {
		var guesses = [];
		this.each(function(game) {
			if (game.get("title").toLowerCase().indexOf(partial.toLowerCase()) != -1) {
				guesses.push(game.get("title"));
			}

		});
		console.log(guesses);
		return guesses;
	}
});

app.games = new app.GamesList();