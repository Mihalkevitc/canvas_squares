import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Отталкивание частиц от курсора мыши.
 * Частицы получают импульс в сторону от курсора.
 * Со временем скорость затухает (торможение).
 */
export class RepulseBehavior implements IBehavior {
  private radius: number;      // Радиус отталкивания (пикселей)
  private force: number;       // Сила отталкивания
  private damping: number;     // Коэффициент торможения (0.95 = теряем 5% скорости в кадре)
  private minSpeed: number;    // Минимальная скорость, ниже которой не тормозим

  constructor(radius: number = 550, force: number = 5.0, damping: number = 0.97, minSpeed: number = 1.0) {
    this.radius = radius;
    this.force = force;
    this.damping = damping;
    this.minSpeed = minSpeed;
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    // Применяем торможение ко всем частицам (возвращаем к покою)
    for (const p of particles) {
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > this.minSpeed) {
        p.vx *= this.damping;
        p.vy *= this.damping;
      }
    }

    // Если нет курсора — только торможение
    if (mouseX === undefined || mouseY === undefined) return;

    // Отталкивание от курсора
    for (const p of particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      
      if (dist < this.radius && dist > 0) {
        // Чем ближе к курсору, тем сильнее удар
        const power = (1 - dist / this.radius) * this.force;
        
        // Нормализованное направление ОТ курсора (к частице)
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Добавляем импульс (без ограничения скорости, частицы могут улететь)
        p.vx += nx * power;
        p.vy += ny * power;
      }
    }
  }
}
