import { Particle } from '../core/Particle';
import { IBehavior } from './IBehavior';

let time = 0;

/**
 * Волновое движение: частицы двигаются по синусоидальным траекториям.
 * Создаёт эффект «ряби на воде».
 * Мышь не влияет — это чисто procedural анимация.
 */
export class WaveBehavior implements IBehavior {
  private amplitude: number;     // Высота волны
  private frequency: number;     // Частота (густота волн)
  private speed: number;         // Скорость движения волны

  constructor(amplitude: number = 0.8, frequency: number = 0.015, speed: number = 0.03) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.speed = speed;
  }

  apply(particles: Particle[]): void {
    time += this.speed;
    
    for (const p of particles) {
      // Волновое смещение зависит от позиции и времени
      // Частицы движутся по синусоиде
      let waveX = Math.sin(p.y * this.frequency + time) * this.amplitude;
      let waveY = Math.cos(p.x * this.frequency + time * 0.5) * this.amplitude;
      
      p.vx += waveX;
      p.vy += waveY;
      
      // Ограничение скорости
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 3) {
        p.vx = (p.vx / speed) * 3;
        p.vy = (p.vy / speed) * 3;
      }
    }
  }
}
