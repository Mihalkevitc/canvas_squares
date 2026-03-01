import { Particle } from '../core/Particle';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(particles: Particle[]): void {
    // Заливка чёрным (стирает предыдущий кадр)
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    for (const particle of particles) {
      particle.draw(this.ctx);
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}