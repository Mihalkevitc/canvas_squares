import { Particle } from './Particle';
import { IBehavior } from '../behaviors/IBehavior';
import { FollowMouseBehavior } from '../behaviors/FollowMouseBehavior';
import { GravityBehavior } from '../behaviors/GravityBehavior';
import { RepulseBehavior } from '../behaviors/RepulseBehavior';
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
  private behavior: IBehavior;
  private configLoader: ConfigLoader;
  private animationId: number | null = null;
  private isRunning: boolean = false;
  private currentBehaviorName: string = 'followMouse';

  constructor() {
    this.behavior = new FollowMouseBehavior();
    this.configLoader = new ConfigLoader();
  }

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

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.border = '1px solid black';
    
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.background = 'black';
    
    this.ctx = this.canvas.getContext('2d')!;
    
    let particleConfig: ParticleConfig = config.config!;
    this.createParticles(particleConfig);
    
    if (particleConfig.behavior) {
      this.setBehavior(particleConfig.behavior);
    }
    
    this.setupMouseListener();
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

  // Публичный метод для смены поведения
  setBehavior(behaviorName: string, params?: any): void {
    this.currentBehaviorName = behaviorName;
    
    switch (behaviorName) {
      case 'gravity':
        this.behavior = new GravityBehavior(params?.G || 0.05);
        break;
      case 'repulse':
        this.behavior = new RepulseBehavior(params?.radius || 100, params?.force || 0.8);
        break;
      case 'followMouse':
      default:
        this.behavior = new FollowMouseBehavior();
        break;
    }
  }

  private setupMouseListener(): void {
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Применяем поведение, реагирующее на мышь
      this.behavior.apply(this.particles, mouseX, mouseY);
    });
  }

  private animate = (): void => {
    if (!this.isRunning) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Для гравитации применяем поведение в каждом кадре (без мыши)
    if (this.currentBehaviorName === 'gravity') {
      this.behavior.apply(this.particles);
    }
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      
      // Проверка границ
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
