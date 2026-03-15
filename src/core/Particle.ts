// Типы форм частиц
export type ParticleShape = 'square' | 'circle' | 'triangle';

// Класс, представляющий отдельную частицу
export class Particle {
  x: number;            // координаты
  y: number;
  vx: number;           // скорость
  vy: number;
  size: number;         // размер
  color: string;        // цвет
  shape: ParticleShape; // форма

  constructor(x: number, y: number, vx: number, vy: number, size: number, color: string, shape: ParticleShape = 'square') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.shape = shape;
  }

  // Обновление позиции по скорости
  update(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  // Отрисовка частицы в зависимости от формы
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    
    switch (this.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        const height = this.size * Math.sqrt(3) / 2;
        ctx.moveTo(this.x, this.y - height / 2);
        ctx.lineTo(this.x - this.size / 2, this.y + height / 2);
        ctx.lineTo(this.x + this.size / 2, this.y + height / 2);
        ctx.fill();
        break;
      case 'square':
      default:
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        break;
    }
  }
}
