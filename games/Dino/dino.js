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

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
// let cactusHeight = 70;

let cactus1Img;
let cactus2Img;
let cactus3Img;

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
  gravity: 0.1,
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
  };

  // Start the game loop
  update();
};

// Function to generate a random cactus type
function generateCactus() {
  let cactusType = Math.floor(Math.random() * 2) + 1;
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

// Function to check for collisions
function checkCollision() {
  for (let cactus of cactusArray) {
    if (
      dino.x + dino.width > cactus.x &&
      dino.x < cactus.x + cactus.width &&
      dino.y + dino.height > cactus.y
    ) {
      // Game Over logic
      alert("Game Over!");
      location.reload(); // Reload the page to restart the game
    }
  }
}

// Jumping function
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

  // Generate new cactus at random intervals
  if (Math.random() < 0.01) {
    generateCactus();
  }

  // Move the cacti
  for (let cactus of cactusArray) {
    cactus.x -= 3; // Move cactus to the left
  }

  // Remove cacti that have gone off-screen
  cactusArray = cactusArray.filter((cactus) => cactus.x + cactus.width > 0);

  // Check for collisions
  checkCollision();

  // Clear the canvas
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Draw the scrolling background
  context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);
  context.drawImage(
    summerImg,
    summerX + summerWidth,
    summerY,
    summerWidth,
    summerHeight
  ); // Draw a second image to create a seamless effect

  // Draw cacti
  for (let cactus of cactusArray) {
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );
  }

  // Draw the Dino
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

// Event listener for keydown events
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
