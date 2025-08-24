var canvas = document.createElement('canvas');

document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0px';
canvas.style.left = '0px';
// Скрывает полосы прокрутки сверху и снизу
document.body.style.overflow = 'hidden' 

canvas.style.border = '1px solid black'

var ctx = canvas.getContext('2d');

canvas.style.background = 'black';

// var x = 0;
// var y = 0;

// function drawFrame(){
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = 'teal';
//     ctx.fillRect(x, 100, 50, 50);

//     ctx.fillRect(x, 200, 50, 50);

//     ctx.fillStyle = '#FF8C00';
//     ctx.fillRect(500, y, 50, 50);

//     ctx.fillRect(600, y, 50, 50);

//     x += 10;
//     y += 10;
//     if(x > canvas.width){
//         x = -50;
//     }
//     if(y > canvas.height){
//         y = -50;
//     }

//     requestAnimationFrame(drawFrame);
// }

// drawFrame();

class Square {
    constructor(x, y, width, height, color, speedX, speedY) {
        this.x = x; // позиция по X
        this.y = y; // позиция по Y
        this.width = width; // ширина
        this.height = height; // высота
        this.color = color; // цвет
        this.speedX = speedX; // скорость по X
        this.speedY = speedY; // скорость по Y
    }

    // Метод для обновления позиции
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Проверка границ canvas
        if (this.x > canvas.width) this.x = -this.width;
        if (this.x < -this.width) this.x = canvas.width;
        if (this.y > canvas.height) this.y = -this.height;
        if (this.y < -this.height) this.y = canvas.height;
    }

    // Метод для рисования
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Массив для хранения всех квадратов
let squares = [];

// Создаем несколько квадратов с разными параметрами
for (let i = 0; i < 10000; i++) {
    let randomX = Math.random() * canvas.width;
    let randomY = Math.random() * canvas.height;
    let randomColor = Math.random() > 0.5 ? '#FF69B4' : 'white';
    let randomSpeedX = (Math.random() - 0.5) * 8; // от -4 до 4
    let randomSpeedY = (Math.random() - 0.5) * 8; // от -4 до 4
    
    squares.push(new Square(
        randomX, randomY, 
        5, 5, 
        randomColor, 
        randomSpeedX, randomSpeedY
    ));
}

// Функция анимации
// function drawFrame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Обновляем и рисуем ВСЕ квадраты
//     for (let i = 0; i < squares.length; i++) {
//         squares[i].update();
//         squares[i].draw();
//     }
    
//     requestAnimationFrame(drawFrame);
// }

// Буферизация анимации
let lastTime = 0;
const TARGET_FPS = 100;

function drawFrame(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime > 1000 / TARGET_FPS) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < squares.length; i++) {
            squares[i].update();
            squares[i].draw();
        }
        
        lastTime = timestamp;
    }
    
    requestAnimationFrame(drawFrame);
}


drawFrame();

// Добавляем обработчик мыши
canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    
    // Меняем направление квадратов к курсору
    for (let i = 0; i < squares.length; i++) {
        let dx = mouseX - squares[i].x;
        let dy = mouseY - squares[i].y;

        //(нормализация через магнитуду): т.к. Math.sqrt() - довольно тяжёлая операция
        let magnitude = dx * dx + dy * dy;
        if (magnitude > 0) {
            magnitude = Math.sqrt(magnitude);
            squares[i].speedX = dx / magnitude * 3;
            squares[i].speedY = dy / magnitude * 3;
        }
    }
});