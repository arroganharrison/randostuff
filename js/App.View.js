var appView = Backbone.View.extend({
	el: "#app",
	initialize: function() {
		this.inputTitle = this.$("#review-input-title");
		this.inputGenre = this.$("#review-input-genre");
		this.inputRating = this.$("#review-input-rating");
		app.reviews.on('add', this.appendOne, this);
		app.reviews.on('sort', this.appendAll, this);
		app.reviews.fetch();
		app.games.fetch();
	},

	events: {
		'click #make-review': 'makeReview',
		'keypress #review-input': 'makeReview2',
		'click .sort': 'sortCollection',
		'click .title': 'showGameAddlInfo',
		'keyup #review-input-title': 'guess',
		'click .guess': 'fillInReview',
		'blur #review-input-picture': 'findPicture'

	},

	makeReview: function() {
		var newReview = app.reviews.create({
			"title": this.inputTitle.val(), 
			"genre": this.inputGenre.val(), 
			"rating": this.inputRating.val(),
			"created_at": Date()
		});
		newReview.updateGame();
		this.input.val('');
	},

	guess: function(e) {
		if ( e.which == 13 || !this.inputTitle.val().trim() ) { // ENTER_KEY = 13
          $("#guesses").html("");  
          return;
        }
        var input = this.inputTitle.val();
        console.log(input);
        var guesses = app.games.searchTitle(input);
        $("#guesses").html("");
        for (guess in guesses) {
        	$("#guesses").append(
        		'<span class="title guess">'+
        		'<a href="#">' + guesses[guess] +
        		'</a></span> &emsp;'
        		);
        }
        console.log(app.games);

	},

	makeReview2: function(e) {
		if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return;
        }
		app.reviews.create({"title": this.inputTitle.val(), "genre": this.inputGenre.val()});
		this.input.val('');
	},

	appendOne: function(review) {
		var tmpReview = new app.ReviewView({model: review});
		$("#reviews-div").prepend(tmpReview.render().el);
	},

	appendOneWhere: function(review, appendDiv) {
		var tmpReview = new app.ReviewView({model: review});
		$(appendDiv).prepend(tmpReview.render().el);
	},

	appendAll: function() {
		
		//console.log("Hello from appendAll");
		$("#reviews-div").html("");
		app.reviews.each(this.appendOne, this);
	},

	sortCollection: function(e) {
		var clicked = $(e.target);
		console.log(clicked.val());
		if (clicked.val() == "rank") {
			app.reviews.comparator = "rank";
		}
		else if (clicked.val() == "created_at") {
			// app.reviews.comparator = function(model) {
   //      		return -model.get('created_at');
   //  		}
   			app.reviews.comparator = "created_at";
		}
		else if (clicked.val() == "title") {
			app.reviews.comparator = "title";
		}
		else {
			alert("Not a valid sort!");
		}
		app.reviews.sort();
		console.log(app.reviews.pluck(clicked.val()));
	},

	showGameAddlInfo: function(e) {
		var tmpgame = app.games.findWhere({"title": e.target.text});
		var template = _.template(
		'<div id="game-info"> ' +
			'<span id="thumbnail"> </span>'+
			'<span id="title"> <em>Title</em>: <a href="#"><%= title %></a></span> &emsp;' +
			'<span id="genre"> <em>Genre</em>: <%= genre %></span> &emsp;' +
			'<span id="rating"> <em>Rating</em>: <%= rating %></span> <br />' +
			'<span id="numReviews"> <em>Number of Reviews</em>: <%= numReviews %></span>'+
		'</div>' +
		'<div id="game-reviews"">'+
		'</div>'
		);
		$("#addl-info").html(template(tmpgame.toJSON()));
		var relevantReviews = app.reviews.where({"title": e.target.text});
		relevantReviews = new app.ReviewList(relevantReviews);
		var appendDiv = "#game-reviews";
		relevantReviews.each(function(review) {
			var tmpReview = new app.ReviewView({model: review});
			$(appendDiv).prepend(tmpReview.render().el);
		});
		
	},

	fillInReview: function(e) {
		var tmpgame = app.games.findWhere({"title": e.target.text});
		this.inputTitle.val(tmpgame.get("title"));
		this.inputGenre.val(tmpgame.get("genre"));
	},

	findPicture: function() {
		console.log("findPicture");
		if ($("#review-input-picture").val() != "") {
			$("#review-input-thumbnail").html(
				'<img src="'+$('#review-input-picture').val() +
				'" style="height: 40px;"/>'
				);
		}
	}





});

app.appView = new appView();