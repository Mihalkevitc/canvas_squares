import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Взрыв: при клике мыши частицы разлетаются от точки удара.
 * Сила взрыва зависит от расстояния до центра.
 * 
 * Параметры:
 * - radius: радиус действия взрыва (пикселей)
 * - duration: длительность эффекта (кадров)
 * - damping: коэффициент торможения после взрыва
 */
export class ExplosionBehavior implements IBehavior {
  private explosionX: number | null;
  private explosionY: number | null;
  private explosionTimer: number;
  private explosionStrength: number;
  private explosionRadius: number;
  private explosionDuration: number;
  private damping: number;

  constructor(radius: number = 150, duration: number = 10, damping: number = 0.99) {
    this.explosionX = null;
    this.explosionY = null;
    this.explosionTimer = 0;
    this.explosionStrength = 0;
    this.explosionRadius = radius;
    this.explosionDuration = duration;
    this.damping = damping;
  }

  // Вызов взрыва (из ParticleSystem)
  explode(x: number, y: number, strength: number = 8): void {
    this.explosionX = x;
    this.explosionY = y;
    this.explosionStrength = strength;
    this.explosionTimer = this.explosionDuration;
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    // Если есть активный взрыв
    if (this.explosionX !== null && this.explosionTimer > 0) {
      for (const p of particles) {
        const dx = p.x - this.explosionX;
        const dy = p.y - this.explosionY;
        const dist = Math.hypot(dx, dy);
        
        if (dist < this.explosionRadius && dist > 0) {
          const power = (1 - dist / this.explosionRadius) * this.explosionStrength;
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
      p.vx *= this.damping;
      p.vy *= this.damping;
      
      const speed = Math.hypot(p.vx, p.vy);
      if (speed < 0.05) {
        p.vx = 0;
        p.vy = 0;
      }
    }
  }
}
