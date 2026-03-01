// Класс, представляющий отдельную частицу
export class Particle {
  x: number;            // координаты
  y: number;
  vx: number;           // скорость
  vy: number;
  size: number;         // размер квадрата
  color: string;        // цвет

  constructor(x: number, y: number, vx: number, vy: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
  }

  // Обновление позиции по скорости
  update(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  // Отрисовка квадратной частицы
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
