import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Вихрь: частицы вращаются вокруг курсора по спирали.
 * Чем ближе к центру, тем быстрее вращение.
 * 
 * Математика: 
 * 1. Вычисляем вектор от частицы к курсору (dx, dy)
 * 2. Нормализуем и поворачиваем на 90° (перпендикуляр) — это даёт тангенциальную скорость
 * 3. Сила зависит от расстояния: чем ближе к курсору, тем сильнее
 * 4. Добавляем небольшое притяжение к центру, чтобы частицы не улетали
 * 5. Ограничиваем максимальную скорость (maxSpeed = 5)
 */
export class VortexBehavior implements IBehavior {
  private strength: number;      // Сила закручивания
  private radius: number;        // Радиус действия
  private maxSpeed: number;      // Максимальная скорость

  constructor(strength: number = 0.15, radius: number = 200, maxSpeed: number = 5) {
    this.strength = strength;
    this.radius = radius;
    this.maxSpeed = maxSpeed;
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    if (mouseX === undefined || mouseY === undefined) return;

    for (const p of particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      
      if (dist < this.radius && dist > 0) {
        // Вектор, перпендикулярный направлению к курсору (закручивание)
        // (nx, ny) — единичный вектор касательной
        const nx = -dy / dist;
        const ny = dx / dist;
        
        // Сила тем больше, чем ближе к центру (линейно от 0 до 1)
        const power = (1 - dist / this.radius) * this.strength;
        
        // Тангенциальная скорость (вращение)
        p.vx += nx * power;
        p.vy += ny * power;
        
        // Радиальная компонента (притяжение к центру) — чтобы частицы не улетали
        // Чем дальше, тем сильнее притяжение
        const pullX = (mouseX - p.x) * 0.01;
        const pullY = (mouseY - p.y) * 0.01;
        p.vx += pullX;
        p.vy += pullY;
      }
      
      // Ограничение максимальной скорости (стабильность симуляции)
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > this.maxSpeed) {
        p.vx = (p.vx / speed) * this.maxSpeed;
        p.vy = (p.vy / speed) * this.maxSpeed;
      }
    }
  }
}
