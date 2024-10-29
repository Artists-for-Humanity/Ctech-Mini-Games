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
  gravity: 0.5,
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
    context.drawImage(
      summerImg,
      summer.x,
      summer.y,
      summer.width,
      summer.height
    );
  };

  dinoImg = new Image();
  dinoImg.src = "./dino assets/dino.png";
  dinoImg.onload = function () {
    // context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
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
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
