var View = function($el){
  this.dimension = 30;
  this.board = new Board(this.dimension);
  this.$el = $el;
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

  // Move Up
  if(keycode === 38){
    if(this.board.snake.direction[0] === 0){
      this.board.snake.direction = [-1,0];
    }
  }
  // Move Down
  else if(keycode === 40){
    if(this.board.snake.direction[0] === 0){
      this.board.snake.direction = [1,0];
    }
  }
  // Move Left
  else if(keycode === 37){
    if(this.board.snake.direction[1] === 0){
      this.board.snake.direction = [0,-1];
    }
  }
  // Move Right
  else if(keycode === 39){
    if(this.board.snake.direction[1] === 0){
      this.board.snake.direction = [0,1];
    }
  }
}

View.prototype.step = function(){
  if (this.board.snake.move()){
    clearInterval(this.set);
  }
  this.board.generateApple();
  // this.board.render();
  this.draw();
}

View.prototype.run = function(){
  var that = this;
  this.set = setInterval(that.step.bind(that), 100);
}

View.prototype.draw = function () {

  this.$el.children().remove();

  var temp = "";

  for(var i = 0; i < this.dimension; i++){
    for(var j = 0; j < this.dimension; j++){
      temp += "<li></li>";
    }
  }

  var $html = $(temp);

  this.$el.append($html);

  var segments = this.board.snake.segments;

  for (var i =0; i < segments.length; i++){
    var searchString = ":nth-child(" + (segments[i][0] * this.dimension + segments[i][1] + 1) + ")"
    this.$el.find(searchString).addClass("snake");
  }

  var searchString = ":nth-child(" + (this.board.apple[0] * this.dimension + this.board.apple[1] + 1) + ")";
  this.$el.find(searchString).addClass("apple");
}
