import { Particle } from './Particle';
import { ConfigLoader, ParticleConfig } from '../loaders/ConfigLoader';

export interface ParticleSystemConfig {
  canvasId?: string;
  canvas?: HTMLCanvasElement;
  config?: ParticleConfig;
  presetId?: string;
  apiUrl?: string;
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isRunning: boolean = false;

  async init(config: ParticleSystemConfig): Promise<void> {
    if (config.canvas) {
      this.canvas = config.canvas;
    } else if (config.canvasId) {
      const canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
      if (!canvas) throw new Error('Canvas with id ' + config.canvasId + ' not found');
      this.canvas = canvas;
    } else {
      throw new Error('Either canvasId or canvas element must be provided');
    }

    // Настройка canvas КАК В ОРИГИНАЛЕ
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.border = '1px solid black';
    
    // Скрываем скролл
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.background = 'black';
    
    this.ctx = this.canvas.getContext('2d')!;
    
    // Загрузка конфигурации (упрощённо)
    let particleConfig: ParticleConfig = config.config!;
    
    this.createParticles(particleConfig);
    
    // Обработчик мыши КАК В ОРИГИНАЛЕ
    this.setupMouseListener();
    
    // Запуск анимации КАК В ОРИГИНАЛЕ (без контроля FPS)
    this.start();
  }

  private createParticles(config: ParticleConfig): void {
    this.particles = [];
    
    for (let i = 0; i < config.particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const vx = (Math.random() - 0.5) * config.maxSpeed;
      const vy = (Math.random() - 0.5) * config.maxSpeed;
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const size = config.particleSize;
      
      this.particles.push(new Particle(x, y, vx, vy, size, color));
    }
  }

  private setupMouseListener(): void {
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      for (let i = 0; i < this.particles.length; i++) {
        const dx = mouseX - this.particles[i].x;
        const dy = mouseY - this.particles[i].y;
        let magnitude = dx * dx + dy * dy;
        if (magnitude > 0) {
          magnitude = Math.sqrt(magnitude);
          this.particles[i].vx = (dx / magnitude) * 2;
          this.particles[i].vy = (dy / magnitude) * 2;
        }
      }
    });
  }

  private animate = (): void => {
    if (!this.isRunning) return;
    
    // 1. Стираем всё
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 2. Обновляем и рисуем каждую частицу (как в оригинале)
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      
      // Проверка границ (как в оригинале)
      if (this.particles[i].x > this.canvas.width) this.particles[i].x = -this.particles[i].size;
      if (this.particles[i].x < -this.particles[i].size) this.particles[i].x = this.canvas.width;
      if (this.particles[i].y > this.canvas.height) this.particles[i].y = -this.particles[i].size;
      if (this.particles[i].y < -this.particles[i].size) this.particles[i].y = this.canvas.height;
      
      this.particles[i].draw(this.ctx);
    }
    
    this.animationId = requestAnimationFrame(this.animate);
  };

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animationId = requestAnimationFrame(this.animate);
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  destroy(): void {
    this.stop();
    this.particles = [];
  }
}