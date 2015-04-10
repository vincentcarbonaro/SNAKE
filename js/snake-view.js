var View = function($el){
  this.dimension = 30;
  this.board = new Board(this.dimension);
  this.$current = $el.find('.current-score');
  this.$top = $el.find('.top-score');
  this.$ul = $el.find('ul')
  this.bindEvents();
  this.run();
  this.topScore = "0";

  $.modal.defaults = {
    overlay: "#000",        // Overlay color
    opacity: 0.75,          // Overlay opacity
    zIndex: 1,              // Overlay z-index.
    escapeClose: false,     // Allows the user to close the modal by pressing `ESC`
    clickClose: false,      // Allows the user to close the modal by clicking the overlay
    closeText: 'Close',     // Text content for the close <a> tag.
    closeClass: '',         // Add additional class(es) to the close <a> tag.
    showClose: false,       // Shows a (X) icon/link in the top-right corner
    modalClass: "modal",    // CSS class added to the element being displayed in the modal.
    spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
    showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
    fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
    fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
  };

  var that = this;

  Parse.initialize("FXco0gYHyIFJPK0YI94p9RGHw0Hrb9OlacTnTDFU", "yaOUYEAkWklLoJOBDkDc5yvWsF6eN6BvQwHxUeuz");

  this.query = new Parse.Query("Score");

  this.query.descending('score').limit(10);

  this.query.find({
    success: function (results) {
      results.forEach(function (el) {
        if(parseInt(el.escape('score')) > parseInt(that.$top.text())) {
          that.$top.html(el.escape('score'));
        }
      });
    },
    error: function () {
      console.log("Failed Query");
    }
  });

}

View.prototype.bindEvents = function(){
  var that = this;
  $(document).on("keydown",function(event){
    that.parseKeycode(event.keyCode)
  })
}

View.prototype.parseKeycode = function(keycode){

  //tremendously obnoxious code to ensure snake cannot turn in on itself
  if (this.board.snake.segments.length === 1){
    switch (keycode) {

      case 38:
        event.preventDefault();
        this.board.snake.direction = [-1,0];
        break;

      case 40:
        event.preventDefault();
        this.board.snake.direction = [1,0];
        break;

      case 37:
        event.preventDefault();
        this.board.snake.direction = [0,-1];
        break;

      case 39:
        event.preventDefault();
        this.board.snake.direction = [0,1];
        break;
      }
  } else {

    if(keycode === 38){ // Move Up
      if (!(this.board.snake.segments[0][1] === this.board.snake.segments[1][1] && this.board.snake.segments[0][0] - 1 === this.board.snake.segments[1][0])) {
        event.preventDefault();
        this.board.snake.direction = [-1,0];
      }
    }
    //move down
    else if (keycode === 40) {
      if (!(this.board.snake.segments[0][1] === this.board.snake.segments[1][1] && this.board.snake.segments[0][0] + 1 === this.board.snake.segments[1][0])) {
        event.preventDefault();
        this.board.snake.direction = [1,0];
      }
    }
    //move left
    else if (keycode === 37) {
      if (!(this.board.snake.segments[0][0] === this.board.snake.segments[1][0] && this.board.snake.segments[0][1] - 1 === this.board.snake.segments[1][1])) {
        event.preventDefault();
        this.board.snake.direction = [0,-1];
      }
    }
    //move right
    else if (keycode === 39) {
      if (!(this.board.snake.segments[0][0] === this.board.snake.segments[1][0] && this.board.snake.segments[0][1] + 1 === this.board.snake.segments[1][1])) {
        event.preventDefault();
        this.board.snake.direction = [0,1];
      }
    }

  }

}

View.prototype.step = function(){
  var that = this;

  //the game is over
  if (this.board.snake.move()){

    clearInterval(this.set);    //the game is over

    $('.new-score').modal();

    $('.top-scores').html("");

    this.query.find({
      success: function (results) {

        var i = 1;

        $('.score-list-rank').html("<strong><u>Rank</u></strong><br>")
        $('.score-list-name').html("<strong><u>Name</u></strong><br>");
        $('.score-list-score').html("<strong><u>Score</u></strong><br>");

        results.forEach(function (el) {
          $('.score-list-rank').append(i + ". <br>")
          $('.score-list-name').append(el.get('username') + "<br>");
          $('.score-list-score').append(el.get('score') + "<br>");
          i++;
        });

      },
      error: function () {
        console.log("Failed Query");
      }
    });

    $('.saving-score input').val( parseInt(this.$current.text()) );

    var that = this;

    $('.name input').val("");

    $('.submit-score input').click(function (event) {
      event.preventDefault();

      that.newScore = new Parse.Object("Score");

      that.newScore.set("username", $('.name input').val());

      that.newScore.set("score", parseInt(that.$current.text()) );
      that.newScore.save({}, {
        success: function () {
          console.log('Successfull Save');
          that.board.snake.segments = [[1,1]]; //this is the starting point
          that.board.snake.direction = [0,0]; // this is the default starting direction
          that.board.snake.addTo = 0;
          that.run();
          that.board.generateApple();
          that.draw();
        },
        erorr: function () {
          console.log('Failed Save');
          that.board.snake.segments = [[1,1]]; //this is the starting point
          that.board.snake.direction = [0,0]; // this is the default starting direction
          that.board.snake.addTo = 0;
          that.run();
          that.board.generateApple();
          that.draw();
        }
      });

      $('.submit-score input').off('click');

      $.modal.close();
    })

  } else {
    clearInterval(this.set);    //the game is over
    this.set = setInterval(that.step.bind(that), 100 - this.board.snake.segments.length/3);
    this.board.generateApple();
    this.draw();
  }

}

View.prototype.run = function(){
  this.board.apples = [];

  var that = this;
  this.set = setInterval(that.step.bind(that), 100);
}

View.prototype.draw = function () {

  this.score = (Math.floor((this.board.snake.segments.length*5-5)/3))
  this.score = this.score*this.score

  this.$current.html(this.score);

  //insert current score if it beats top score
  if (this.score > parseInt(this.$top.text()) ){
    this.$top.html(this.score);
  }

  this.$ul.children().remove();

  var temp = "";

  for(var i = 0; i < this.dimension; i++){
    for(var j = 0; j < this.dimension; j++){
      temp += "<li></li>";
    }
  }

  var $html = $(temp);

  this.$ul.append($html);

  var segments = this.board.snake.segments;

  for (var i = 0; i < segments.length; i++){
    var searchString = ":nth-child(" + (segments[i][0] * this.dimension + segments[i][1] + 1) + ")"
    this.$ul.find(searchString).addClass("snake");
  }

  var searchString = ":nth-child(" + (this.board.apples[0] * this.dimension + this.board.apples[1] + 1) + ")";
  this.$ul.find(searchString).addClass("apple");
}
