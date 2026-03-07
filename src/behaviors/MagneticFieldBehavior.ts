import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Магнитное поле: частицы движутся по силовым линиям от полюсов.
 * При движении мыши поле искажается, притягивая частицы к курсору.
 * 
 * Параметры:
 * - strength: сила базового поля (синусоидальные линии)
 * - fieldStrength: сила притяжения к курсору (чем выше, тем мощнее магнит)
 * - radius: радиус действия курсора (пикселей)
 * - maxSpeed: максимальная скорость частиц
 */
export class MagneticFieldBehavior implements IBehavior {
  private strength: number;
  private fieldStrength: number;
  private radius: number;
  private maxSpeed: number;

  constructor(strength: number = 0.02, fieldStrength: number = 1.5, radius: number = 200, maxSpeed: number = 4) {
    this.strength = strength;
    this.fieldStrength = fieldStrength;
    this.radius = radius;
    this.maxSpeed = maxSpeed;
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    for (const p of particles) {
      // Базовое движение по синусоидальным линиям
      let fx = Math.sin(p.y * 0.01) * this.strength;
      let fy = Math.cos(p.x * 0.01) * this.strength;
      
      // Искажение поля курсором (магнитное притяжение)
      if (mouseX !== undefined && mouseY !== undefined) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < this.radius && dist > 0) {
          // Сила искажения: чем ближе к курсору, тем сильнее
          // (1 - dist/radius) даёт значение от 1 (у курсора) до 0 (на границе)
          const power = (1 - dist / this.radius) * this.fieldStrength;
          
          // Направление от частицы к курсору
          const ndx = dx / dist;
          const ndy = dy / dist;
          
          // Добавляем притяжение к курсору
          fx += ndx * power;
          fy += ndy * power;
        }
      }
      
      // Применяем ускорение
      p.vx += fx;
      p.vy += fy;
      
      // Ограничение скорости
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > this.maxSpeed) {
        p.vx = (p.vx / speed) * this.maxSpeed;
        p.vy = (p.vy / speed) * this.maxSpeed;
      }
    }
  }
}
