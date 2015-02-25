
var Snake = function (board, dimension) {
  this.dimension = dimension;
  this.segments = [[0,0]];
  this.direction = [0,0];
  this.board = board;
}

Snake.prototype.move = function() {
  var new_spot = [this.segments[0][0] + this.direction[0], this.segments[0][1] + this.direction[1]];
  this.segments.unshift(new_spot);
  if (!this.board.checkEat(new_spot)){
    this.segments.pop();
  }
  return this.checkCollision(new_spot);
}

Snake.prototype.checkCollision = function (new_spot) {
  //if snake went off board
  if (new_spot[0] > this.dimension-1 || new_spot[0] < 0 || new_spot[1] > this.dimension-1 || new_spot[1] < 0 ){
    alert("GAME OVER!");
    return true;
  }

  //if snake collided with self
  for(var i = 1; i < this.segments.length; i++){
    if(this.segments[i][0] === new_spot[0] && this.segments[i][1] === new_spot[1]){
      alert("GAME OVER!");
      return true;
    }
  }
  return false;
}
/////////////////////////////////////////////////////////////

var Board = function (dimension) {
  this.dimension = dimension;
  this.snake = new Snake(this, dimension);
  //this.grid = this.makeGrid();
  this.apple = [];
}

// Board.prototype.makeGrid = function() {
//   var grid = [];
//   for (var i = 0; i < 10; i++){
//     grid.push([]);
//     for (var j = 0; j < 10; j++){
//       grid[i].push('.');
//     }
//   }
//   return grid;
// }

Board.prototype.render = function() {
  var renderBoard = this.makeGrid();
  //console.log("/////////////////////////////////////////");
  for (var i = 0; i < this.snake.segments.length; i++){
    renderBoard[this.snake.segments[i][0]][this.snake.segments[i][1]] = "S";
  }
  // for (var j = 0; j < 10; j++){
  // console.log(renderBoard[j])
  // }
  renderBoard[this.apple[0]][this.apple[1]] = "A";
}

Board.prototype.generateApple = function(){
  if(this.apple.length === 0){
    var x = Math.floor(Math.random()*this.dimension);
    var y = Math.floor(Math.random()*this.dimension);
    this.apple = [x,y];
  }
}

Board.prototype.checkEat = function (new_spot) {
  if (new_spot[0]=== this.apple[0] && new_spot[1]=== this.apple[1]) {
    this.apple = [];
    return true;
  }
}
