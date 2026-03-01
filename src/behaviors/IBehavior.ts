import { Particle } from '../core/Particle';

// Интерфейс для всех стратегий поведения частиц
export interface IBehavior {
  // Применяет поведение к массиву частиц
  // mouseX, mouseY — координаты курсора (опционально, для интерактивных поведений)
  apply(particles: Particle[], mouseX?: number, mouseY?: number): void;
}
