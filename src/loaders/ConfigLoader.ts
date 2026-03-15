export interface ParticleConfig {
  particleCount: number;
  colors: string[];
  particleSize: number;
  maxSpeed: number;
  behavior: string;
  behaviorParams?: Record<string, any>;
  isPublic?: boolean;
  shape?: string;      // 'square', 'circle', 'triangle'
  initSpeed?: number;  // начальная скорость частиц
}

export class ConfigLoader {
  private apiUrl?: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl;
  }

  loadLocal(config: ParticleConfig): ParticleConfig {
    return config;
  }

  async loadRemote(presetId: string): Promise<ParticleConfig> {
    if (!this.apiUrl) {
      throw new Error('API URL is not configured');
    }
    
    const response = await fetch(`${this.apiUrl}/presets/${presetId}`);
    if (!response.ok) {
      throw new Error(`Failed to load preset: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.config as ParticleConfig;
  }
}
