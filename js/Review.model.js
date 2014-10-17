console.log("hello");


app.Review = Backbone.Model.extend({

	updateGame: function() {
		console.log("updateGame Triggered!");
		//var games = new app.GamesList();
		app.games.fetch();
		var titleToMatch = this.get("title");
		var found = app.games.findWhere({"title": titleToMatch});
		if (!found) {
			//var game = new app.Game();
			app.games.create({title: titleToMatch, genre: this.get("genre"), rating: this.get("rating"), numReviews: 1});
			//game.save();
		} else {
			console.log(JSON.stringify(found));
			var tmprating = found.get("rating");
			var numReviews = found.get("numReviews");
			found.set({"numReviews": numReviews+1})
			found.set({"rating": (Number(tmprating)+Number(this.get("rating")))/(numReviews+1)});
			found.save();
		}

	},
	initialize: function() {
		console.log("New Review instatiated.");
		//this.updateGame();
	},
	defaults: {
		title: "default",
		genre: "none",
		rating: "0",
		rank: 0,
		modifyVote: "+"

	}
});

app.ReviewView = Backbone.View.extend({
	tagName: "div",
	className: "feed-holder",
	
	template: _.template(
		'<span class="thumbnail"> </span>'+
		'<span class="title feed"> <em>Title</em>: <a href="#"><%= title %></a></span> &emsp;' +
		'<span class="genre feed"> <em>Genre</em>: <%= genre %></span> &emsp;' +
		'<span class="rating feed"> <em>Rating</em>: <%= rating %></span> &emsp;' +
		'<span class="rank feed"> <em>Rank</em>: <%= rank %></span> &emsp;' +
		'<span class="vote"> <button id="vote-btn"><%= modifyVote %>1</btn></span>'
		),

	events: {
		'click .vote': 'upRank',
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
        return this;
	},

	upRank: function() {
		var score = this.model.get("rank");
		if (this.model.get("modifyVote") == "+") {
			this.model.set("modifyVote", "-");
			this.model.set("rank", score+1);
				
		}
		else if (this.model.get("modifyVote") == "-") {
			this.model.set("modifyVote", "+");	
			this.model.set("rank", score-1);
		}
		this.model.save();
	},

	
	initialize: function() {
		this.model.on('change:rank', this.render, this);
	}
})

app.ReviewList = Backbone.Collection.extend({
	model: app.Review,
	localStorage: new Store("social-reviews")
});

app.reviews = new app.ReviewList();
//temp = new Review();