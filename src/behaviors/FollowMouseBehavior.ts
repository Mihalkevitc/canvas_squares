import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

export class FollowMouseBehavior implements IBehavior {
  apply(particles: Particle[], mouseX?: number, mouseY?: number): void {
    if (mouseX === undefined || mouseY === undefined) return;
    
    for (const particle of particles) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      let magnitude = dx * dx + dy * dy;
      if (magnitude > 0) {
        magnitude = Math.sqrt(magnitude);
        particle.vx = (dx / magnitude) * 2;
        particle.vy = (dy / magnitude) * 2;
      }
    }
  }
}
