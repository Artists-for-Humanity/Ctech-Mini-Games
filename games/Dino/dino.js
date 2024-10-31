let board;
let boardWidth = 950;
let boardHeight = 350;
let context;

let summerWidth = 950;
let summerHeight = 350;
let summerX = 0;
let summerY = 0;
let summerImg;
let summerScrollSpeed = 2; // Speed of background scroll

let cactus1Img;
let cactus1Width = 40;
let cactus1Height = 80;
let cactus1X = 250;
let cactus1Y = boardHeight - cactus1Height;
let cactusSpeed = 1;
let cactus1 = {};

// Dino properties
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
  gravity: 0.4,
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
  cactus1Img.onload = function () {
    context.drawImage(
      cactus1Img,
      cactus1X,
      cactus1Y,
      cactus1Width,
      cactus1Height
    );
  };

  dinoImg = new Image();
  dinoImg.src = "./dino assets/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  update(); // Start the game loop
};

function jump() {
  if (!dino.isJumping) {
    dino.velocityY = -10; // Adjust for jump height
    dino.isJumping = true;
  }
}

function update() {
  requestAnimationFrame(update);
  // Update summer background position for scrolling effect
  summerX -= summerScrollSpeed;
  if (summerX <= -summerWidth) {
    summerX = 0; // Reset to start position
  }
  cactus1X -= cactusSpeed;
  if (cactus1X <= -cactus1Width) {
    cactus1X = boardWidth;
    // Update Dino's position
    if (dino.isJumping) {
      dino.velocityY += dino.gravity; // Apply gravity
      dino.y += dino.velocityY;

      // Check if Dino lands
      if (dino.y >= boardHeight - dinoHeight) {
        dino.y = boardHeight - dinoHeight; // Reset to ground level
        dino.isJumping = false;
        dino.velocityY = 0;
      }
    }

    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas

    // Draw the scrolling background
    context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);
    context.drawImage(
      summerImg,
      summerX + summerWidth,
      summerY,
      summerWidth,
      summerHeight
    ); // Draw a second image to create a seamless effect

    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    context.drawImage(
      cactus1Img,
      cactus1X,
      cactus1Y,
      cactus1Width,
      cactus1Height
    );
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      jump();
    }
  });
}
// check if code got messed up by 'prettier'
