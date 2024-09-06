const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameLoop;
let difficultyLevel = 1;

let touchStartX = 0;
let touchStartY = 0;

startButton.addEventListener('click', startGame);

function startGame() {
    startScreen.style.display = 'none';
    resetGame();
    drawGame();
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0 && dx === 0) {
            dx = 1; dy = 0;
        } else if (deltaX < 0 && dx === 0) {
            dx = -1; dy = 0;
        }
    } else {
        // 垂直滑动
        if (deltaY > 0 && dy === 0) {
            dx = 0; dy = 1;
        } else if (deltaY < 0 && dy === 0) {
            dx = 0; dy = -1;
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
    gameLoop = setTimeout(drawGame, gameSpeed);
}

function clearCanvas() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = '#2E7D32';
        } else {
            // 蛇身
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        
        if (index === 0) {
            // 蛇眼
            ctx.fillStyle = '#FFF';
            ctx.fillRect(segment.x * gridSize + 3, segment.y * gridSize + 3, 4, 4);
            ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 3, 4, 4);
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2*Math.PI);
    ctx.fill();
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    alert(`游戏结束! 得分: ${score}`);
    startScreen.style.display = 'block';
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 150;
    difficultyLevel = 1;
    updateScore();
}

function updateScore() {
    scoreDisplay.textContent = `得分: ${score} | 难度: ${difficultyLevel}`;
}

function increaseSpeed() {
    if (score % 5 === 0) {
        difficultyLevel++;
        gameSpeed = Math.max(50, gameSpeed - 10);
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
    }
});

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);