import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

/**
 * Частицы следуют за курсором мыши.
 * Скорость можно регулировать.
 */
export class FollowMouseBehavior implements IBehavior {
  private speed: number;

  constructor(speed: number = 4) {
    this.speed = speed;
  }

  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    if (mouseX === undefined || mouseY === undefined) return;
    
    for (const particle of particles) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      let magnitude = dx * dx + dy * dy;
      if (magnitude > 0) {
        magnitude = Math.sqrt(magnitude);
        particle.vx = (dx / magnitude) * this.speed;
        particle.vy = (dy / magnitude) * this.speed;
      }
    }
  }
}
