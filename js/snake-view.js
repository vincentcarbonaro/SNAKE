var View = function($el){
  this.dimension = 30;
  this.board = new Board(this.dimension);
  this.$current = $el.find('.current-score');
  this.$top = $el.find('.top-score');
  this.$ul = $el.find('ul')
  this.bindEvents();
  this.run();
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
        this.board.snake.direction = [-1,0];
        break;

      case 40:
        this.board.snake.direction = [1,0];
        break;

      case 37:
        this.board.snake.direction = [0,-1];
        break;

      case 39:
        this.board.snake.direction = [0,1];
        break;
      }
  } else {

    if(keycode === 38){ // Move Up
      if (!(this.board.snake.segments[0][1] === this.board.snake.segments[1][1] && this.board.snake.segments[0][0] - 1 === this.board.snake.segments[1][0])) {
        this.board.snake.direction = [-1,0];
      }
    }
    //move down
    else if (keycode === 40) {
      if (!(this.board.snake.segments[0][1] === this.board.snake.segments[1][1] && this.board.snake.segments[0][0] + 1 === this.board.snake.segments[1][0])) {
        this.board.snake.direction = [1,0];
      }
    }
    //move left
    else if (keycode === 37) {
      if (!(this.board.snake.segments[0][0] === this.board.snake.segments[1][0] && this.board.snake.segments[0][1] - 1 === this.board.snake.segments[1][1])) {
        this.board.snake.direction = [0,-1];
      }
    }
    //move right
    else if (keycode === 39) {
      if (!(this.board.snake.segments[0][0] === this.board.snake.segments[1][0] && this.board.snake.segments[0][1] + 1 === this.board.snake.segments[1][1])) {
        this.board.snake.direction = [0,1];
      }
    }

  }

}

View.prototype.step = function(){
  var that = this;
  if (this.board.snake.move()){
    clearInterval(this.set);    //the game is over
    this.board.snake.segments = [[1,1]]; //this is the starting point
    this.board.snake.direction = [0,0]; // this is the default starting direction
    this.board.snake.addTo = 0;
    this.run();
  } else {
    clearInterval(that.set);
    that.set = setInterval(that.step.bind(that), 100 - this.board.snake.segments.length/3);
  }

  this.board.generateApple();
  this.draw();
}

View.prototype.run = function(){
  this.board.apples = [];

  var that = this;
  this.set = setInterval(that.step.bind(that), 100);
}

View.prototype.draw = function () {
  this.$current.html(this.board.snake.segments.length*5 - 5);

  if (this.board.snake.segments.length*5-5 > parseInt(this.$top.text()) ){
    this.$top.html(this.board.snake.segments.length*5-5);
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
