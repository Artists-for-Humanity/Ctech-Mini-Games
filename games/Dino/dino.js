let board; 
let boardWidth = 950;
let boardHeight = 350;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

window.onload = function () {
    board = document.getElementById("board");
board.height = boardHeight;
board.width = boardWidth;
 context = board.getContext("2d")

dinoImg = new Image ();
dinoImg.src = "./dino assets/dino.png";
dinoImg.onload = function() {
context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}


}


function update() {
    requestAnimationFrame (update);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}