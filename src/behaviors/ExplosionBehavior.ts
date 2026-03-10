import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Взрыв: при клике мыши частицы разлетаются от точки удара.
 * Сила взрыва зависит от расстояния до центра.
 */
export class ExplosionBehavior implements IBehavior {
  private explosionX: number | null;
  private explosionY: number | null;
  private explosionTimer: number;
  private explosionStrength: number;

  constructor() {
    this.explosionX = null;
    this.explosionY = null;
    this.explosionTimer = 0;
    this.explosionStrength = 0;
  }

  // Вызов взрыва (из ParticleSystem)
  explode(x: number, y: number, strength: number = 8): void {
    this.explosionX = x;
    this.explosionY = y;
    this.explosionStrength = strength;
    this.explosionTimer = 10; // Длительность эффекта (кадров)
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    // Если есть активный взрыв
    if (this.explosionX !== null && this.explosionTimer > 0) {
      for (const p of particles) {
        const dx = p.x - this.explosionX;
        const dy = p.y - this.explosionY;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 150) {
          const power = (1 - dist / 150) * this.explosionStrength;
          const ndx = dx / dist;
          const ndy = dy / dist;
          p.vx += ndx * power;
          p.vy += ndy * power;
        }
      }
      this.explosionTimer--;
      if (this.explosionTimer === 0) {
        this.explosionX = null;
        this.explosionY = null;
      }
    }
    
    // Торможение частиц
    for (const p of particles) {
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      const speed = Math.hypot(p.vx, p.vy);
      if (speed < 0.05) {
        p.vx = 0;
        p.vy = 0;
      }
    }
  }
}
