// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
let playerScore = 0;
let computerScore = 0;

// Player paddle position
const player = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  speed: 6,
};

// Computer paddle position
const computer = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  speed: 5,
};

// Ball position and velocity
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 5,
  dx: 5,
  dy: 5,
};

// Key press state
const keys = {
  w: false,
  s: false,
};

// Listen for key presses
document.addEventListener("keydown", function (e) {
  if (e.key === "w" || e.key === "W") {
    keys.w = true;
  }
  if (e.key === "s" || e.key === "S") {
    keys.s = true;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "w" || e.key === "W") {
    keys.w = false;
  }
  if (e.key === "s" || e.key === "S") {
    keys.s = false;
  }
});

// Draw rectangles (paddles)
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// Draw circle (ball)
function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Draw the net
function drawNet() {
  const netWidth = 2;
  const netHeight = 10;
  const netX = canvas.width / 2 - netWidth / 2;
  let netY = 0;
  ctx.fillStyle = "#fff";
  while (netY < canvas.height) {
    ctx.fillRect(netX, netY, netWidth, netHeight);
    netY += 30;
  }
}

// Draw text (score)
function drawText(text, x, y) {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(text, x, y);
}

// Reset ball to center
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Reverse direction
  ball.dx = -ball.dx;
  // Randomize y velocity
  ball.dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2);
}

// Update ball position
function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top and bottom collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Left and right collision (scoring)
  if (ball.x - ball.radius < 0) {
    computerScore++;
    updateScore();
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    updateScore();
    resetBall();
  }

  // Paddle collision
  // Player paddle
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx = -ball.dx;
    // Adjust dy based on where it hit the paddle
    let deltaY = ball.y - (player.y + player.height / 2);
    ball.dy = deltaY * 0.3;
  }

  // Computer paddle
  if (
    ball.x + ball.radius > computer.x &&
    ball.y > computer.y &&
    ball.y < computer.y + computer.height
  ) {
    ball.dx = -ball.dx;
    // Adjust dy based on where it hit the paddle
    let deltaY = ball.y - (computer.y + computer.height / 2);
    ball.dy = deltaY * 0.3;
  }
}

// Update player position
function updatePlayer() {
  if (keys.w && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys.s && player.y + player.height < canvas.height) {
    player.y += player.speed;
  }
}

// Update computer position
function updateComputer() {
  // Simple AI: moves the paddle towards the ball's y position
  let target = ball.y - computer.height / 2;
  if (computer.y < target) {
    computer.y += computer.speed;
  } else if (computer.y > target) {
    computer.y -= computer.speed;
  }

  // Prevent computer paddle from going out of bounds
  if (computer.y < 0) computer.y = 0;
  if (computer.y + computer.height > canvas.height)
    computer.y = canvas.height - computer.height;
}

// Update the score display
function updateScore() {
  document.getElementById(
    "scoreBoard"
  ).textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
}

// Clear the canvas
function clear() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Render everything
function render() {
  clear();
  drawNet();
  drawRect(player.x, player.y, player.width, player.height, "#fff");
  drawRect(computer.x, computer.y, computer.width, computer.height, "#fff");
  drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

// The game loop
function gameLoop() {
  updatePlayer();
  updateComputer();
  updateBall();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
