let board;
let boardWidth = 950;
let boardHeight = 350;
let context;

let summerWidth = 950;
let summerHeight = 350;
let summerX = 0;
let summerY = 0;
let summerImg;
let summerScrollSpeed = 6;

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let powerup1Array = [];

function generatePowerup1() {
  let powerup1X = boardWidth;
  let powerup1Y = boardHeight - powerup1Height;

  let powerup1 = {
    x: powerup1X,
    y: powerup1Y,
    width: powerup1Width,
    height: powerup1Height,
    img: powerup1Img,
  };

  powerup1Array.push(powerup1);
}
let powerup1;
let powerup1Width = 30;
let powerup1Height = 40;
let powerup1Img;
let powerup1X = 50;
let powerup1Y = boardheight - powerup1Height;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
  gravity: 0.3,
  velocityY: 0,
  isJumping: false,
};

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  summerImg = new Image();
  summerImg.src = "./dino assets/Summer2.png";
  summerImg.onload = function () {
    context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./dino assets/c1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./dino assets/c2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./dino assets/c3.png";

  dinoImg = new Image();
  dinoImg.src = "./dino assets/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    powerup1Img = new Image();
    powerup1Img.src = "./dino assets/powerup1.png";
  };

  update();
};

let powerup1Collected = false;

function checkPowerup1Collision() {
  for (let powerup1 of powerup1Array) {
    if (
      dino.x + dino.width > powerUp.x &&
      dino.x < powerUp.x + powerUp.width &&
      dino.y + dino.height > powerUp.y
    ) {
      powerup1Array = powerup1Array.filter((item) => item !== powerup1);

      powerup1Collected = true;
      setTimeout(() => {
        powerup1Collected = false;
      }, 3000);
    }
  }
}

function generateCactus() {
  let cactusType = Math.floor(Math.random() * 3) + 1;
  let cactusWidth =
    cactusType === 1
      ? cactus1Width
      : cactusType === 2
      ? cactus2Width
      : cactus3Width;
  let cactusImg =
    cactusType === 1 ? cactus1Img : cactusType === 2 ? cactus2Img : cactus3Img;

  let cactus = {
    x: boardWidth,
    y: boardHeight - cactusHeight,
    width: cactusWidth,
    height: cactusHeight,
    img: cactusImg,
  };

  cactusArray.push(cactus);
}

function checkCollision() {
  for (let cactus of cactusArray) {
    if (
      dino.x + dino.width > cactus.x &&
      dino.x < cactus.x + cactus.width &&
      dino.y + dino.height > cactus.y
    ) {
      alert("Game Over! :(");

      location.reload();
    }
  }
}

function jump() {
  if (!dino.isJumping) {
    dino.velocityY = -12;
    dino.isJumping = true;
  }
}

function update() {
  requestAnimationFrame(update);

  summerX -= summerScrollSpeed;
  if (summerX <= -summerWidth) {
    summerX = 0;
  }

  if (dino.isJumping) {
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;

    if (dino.y >= boardHeight - dinoHeight) {
      dino.y = boardHeight - dinoHeight;
      dino.isJumping = false;
      dino.velocityY = 0;
    }
  }

  if (Math.random() < 0.01) {
    generateCactus();
  }

  for (let cactus of cactusArray) {
    cactus.x -= 3;
  }

  cactusArray = cactusArray.filter((cactus) => cactus.x + cactus.width > 0);

  checkCollision();

  context.clearRect(0, 0, boardWidth, boardHeight);

  context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);
  context.drawImage(
    summerImg,
    summerX + summerWidth,
    summerY,
    summerWidth,
    summerHeight
  );

  for (let cactus of cactusArray) {
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );
  }

  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
