import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

// Перспективная стратегия: гравитационное взаимодействие между частицами
export class GravityBehavior implements IBehavior {
  private G: number = 0.1;  // Гравитационная постоянная
  private minDistance: number = 5;  // Минимальное расстояние для избежания бесконечной силы

  constructor(G?: number) {
    if (G !== undefined) this.G = G;
  }

  apply(particles: Particle[]): void {
    // O(n²) — для каждой пары частиц вычисляем силу притяжения
    for (let i = 0; i < particles.length; i++) {
      let totalFx = 0;
      let totalFy = 0;
      
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distanceSq = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSq);
        
        // Избегаем слишком сильного притяжения на близких расстояниях
        const effectiveDistance = Math.max(distance, this.minDistance);
        
        // Закон всемирного тяготения: F = G * m1 * m2 / r^2
        // Здесь масса частицы пропорциональна её размеру
        const force = (this.G * p1.size * p2.size) / (effectiveDistance * effectiveDistance);
        
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        totalFx += fx;
        totalFy += fy;
      }
      
      particles[i].vx += totalFx;
      particles[i].vy += totalFy;
    }
  }
}
