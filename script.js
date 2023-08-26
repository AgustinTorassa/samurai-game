const player = document.getElementById('player');
const game = document.getElementById('game');

let playerX = 0;
let playerY = 0;
let playerVelocityY = 0;
let isGrounded = false;
const jumpStrength = 12;
const gravity = 0.6;

const keys = {};

const platforms = [];

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function updatePlayerPosition() {
    if (keys['a']) {
        playerX -= 5;
    }
    if (keys['d']) {
        playerX += 5;
    }
    if (keys['w'] && isGrounded) {
        jump();
    }

    // Apply gravity
    playerVelocityY -= gravity;
    playerY += playerVelocityY;

    // Keep the player within the game bounds
    if (playerX < 0) playerX = 0;
    if (playerX > game.offsetWidth - player.offsetWidth) playerX = game.offsetWidth - player.offsetWidth;

    // Prevent the player from falling below the ground
    if (playerY < 0) {
        playerY = 0;
        playerVelocityY = 0;
        isGrounded = true;
    }

    // Check if player touches the ground
    if (playerY === 0) {
        isGrounded = true;
    }

    // Check for collisions with platforms
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            const platformRect = platform.getBoundingClientRect();
            if (playerVelocityY < 0 && playerY > platformRect.top) {
                playerVelocityY = 0;
                playerY = platformRect.top;
                isGrounded = true;
            }
        }        
    }

    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
}

function jump() {
    playerVelocityY = jumpStrength;
    isGrounded = false;
}

// Create platforms
createPlatform(100, 50);
createPlatform(300, 50);
createPlatform(500, 50);
createPlatform(700, 50);

function createPlatform(x, y) {
    const platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = x + 'px';
    platform.style.bottom = y + 'px';
    game.appendChild(platform);
    platforms.push(platform);
}

function checkCollision(player, platform) {
    const playerRect = player.getBoundingClientRect();
    const platformRect = platform.getBoundingClientRect();
    const playerFeet = playerRect.bottom;
    const platformTop = platformRect.top;

    const verticalDistance = platformTop - playerFeet;

    return (
        verticalDistance >= 0 && // Player is above the platform
        verticalDistance <= playerVelocityY && // Prevents passing through the platform
        playerRect.right >= platformRect.left &&
        playerRect.left <= platformRect.right
    );
}


function gameLoop() {
    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// why can't the player collision with platforms check my code?

