const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    velocityY: 0,
    isGrounded: false,
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Center the canvas and set its size
canvas.width = 800;
canvas.height = 600;
canvas.style.margin = 'auto';
canvas.style.display = 'block';
canvas.style.backgroundColor = 'grey';

const jumpStrength = 12;
const gravity = 0.6;

const keys = {};

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

const platforms = [
    { x: 100, y: 50, width: 100, height: 20 },
    { x: 300, y: 50, width: 150, height: 20 },
];

function updatePlayerPosition() {
    if (keys['a']) {
        player.x -= 5;
    }
    if (keys['d']) {
        player.x += 5;
    }
    if (keys['w'] && player.isGrounded) {
        jump();
    }

    // Apply gravity
    player.velocityY -= gravity;
    player.y += player.velocityY;

    // Check for collisions with platforms
    for (const platform of platforms) {
        if (checkCollisions(player, platform)) {
            const playerBottom = canvas.height - player.y;
            const platformTop = canvas.height - platform.y;
            const platformBottom = canvas.height - (platform.y + platform.height);

            if (player.velocityY > 0 && playerBottom > platformTop && player.y > platformBottom) {
                player.y = canvas.height - platformTop;
                player.isGrounded = true;
            } else if (player.velocityY < 0 && player.y < platformTop && playerBottom > platformTop) {
                player.y = canvas.height - (platformTop - player.height);
                player.velocityY = 0;
            }
        }
    }

    // Keep the player within the game bounds
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // Prevent the player from falling below the ground
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
        player.isGrounded = true;
    } else {
        player.isGrounded = false; // Player is not on the ground if above the threshold
    }
}


function jump() {
    player.velocityY = jumpStrength;
    player.isGrounded = false;
}

function checkCollisions(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y + rect1.height > rect2.y &&
        rect1.y < rect2.y + rect2.height
    );
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, canvas.height - player.y - player.height, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    for (const platform of platforms) {
        ctx.fillRect(platform.x, canvas.height - platform.y - platform.height, platform.width, platform.height);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updatePlayerPosition();
    drawPlayer();
    drawPlatforms();
    requestAnimationFrame(gameLoop);
}

gameLoop();
