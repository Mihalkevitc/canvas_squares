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
  private maxSpeed: number;      // Максимальная скорость частиц

  constructor(amplitude: number = 0.8, frequency: number = 0.015, speed: number = 0.03, maxSpeed: number = 3) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
  }

  apply(particles: Particle[]): void {
    time += this.speed;
    
    for (const p of particles) {
      // Волновое смещение зависит от позиции и времени
      let waveX = Math.sin(p.y * this.frequency + time) * this.amplitude;
      let waveY = Math.cos(p.x * this.frequency + time * 0.5) * this.amplitude;
      
      p.vx += waveX;
      p.vy += waveY;
      
      // Ограничение скорости
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > this.maxSpeed) {
        p.vx = (p.vx / speed) * this.maxSpeed;
        p.vy = (p.vy / speed) * this.maxSpeed;
      }
    }
  }
}
