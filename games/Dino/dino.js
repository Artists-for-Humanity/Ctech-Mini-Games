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

//cactus mentioned. pngs shortened to c#

cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
cactusX =700;
cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

cactus1Img = new Image();
cactus1Img.src = "./dino assets/c1.png"

cactus2Img = new Image();
cactus2Img.src = "./dino assets/c2.png"

cactus3Img = new Image();
cactus3Img.src = "./dino assets/c3.png"

requestAnimationFrame (update);
setInterval(placeCactus, 1000);
}



function update() {
    requestAnimationFrame (update);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function placeCactus() {
let cactus - {
    img : null,
    x : cactusX
    y : cactusY,
    width : null,
    height : cactusHeight
}
let placeCactusChance - Math.random(); 

if (placeCactusChance > .90)
    cactus.img = cactus3Img;
cactus.width = cactus3Width;
cactusArray.push(cactus);

else if (placeCactuscHANCE > .78)
    cactus.img = cactus2Img;
cactus.width = cactus2Width;
cactusArray.push(cactus);

else if (placeCactusChance > .50)
cactus.img = cactus1Img;
cactus.width = cactus1Width;
cactusArray.push(cactus);
}









