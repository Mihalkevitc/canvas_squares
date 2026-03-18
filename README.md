# Particle-lib

Разработана клиентская библиотека на TypeScript, реализующая интерактивные визуализации динамических частиц. 
Архитектура основана на паттернах «Фасад» и «Стратегия», что обеспечивает лёгкую расширяемость. 
Библиотека поддерживает 7 поведений частиц, контроль FPS и настройку внешнего вида (форма, цвет, размер частиц). 
Финальная сборка распространяется в виде UMD и ES-модуля, что позволяет интегрировать библиотеку на любой веб-сайт одной строкой кода. 
Для загрузки пресетов с сервера предусмотрен метод initWithPreset. В рамках ВКР библиотека будет интегрирована с веб-конструктором и бэкендом.

```bash
particle-lib/
├── src/
│   ├── core/           # Ядро системы
│   │   ├── Particle.ts       # Отдельная частица (позиция, скорость, форма, цвет)
│   │   └── ParticleSystem.ts # Главный фасад (управление canvas, анимация, FPS)
│   ├── behaviors/      # Стратегии поведения (паттерн «Стратегия»)
│   │   ├── IBehavior.ts      # Интерфейс для всех поведений
│   │   ├── FollowMouseBehavior.ts
│   │   ├── GravityBehavior.ts
│   │   ├── RepulseBehavior.ts
│   │   ├── MagneticFieldBehavior.ts
│   │   ├── VortexBehavior.ts
│   │   ├── WaveBehavior.ts
│   │   └── ExplosionBehavior.ts
│   ├── rendering/      # Рендеринг (управление Canvas)
│   ├── loaders/        # Загрузка конфигураций
│   └── index.ts        # Единая точка экспорта
├── dist/               # Сборка (particle-lib.umd.js, particle-lib.es.js)
├── package.json
└── tsconfig.json
```

### Ключевые принципы:

Фасад (ParticleSystem) - простой интерфейс для внешнего мира
Стратегия (IBehavior) - легко добавлять новые поведения без изменения ядра
FPS контроль - экономия ресурсов

### Интеграция в проект:

```bash
<script src="https://cdn.jsdelivr.net/gh/Mihalkevitc/particle-lib@main/dist/particle-lib.umd.js"></script>

<script>
  const ps = new ParticleLib.ParticleSystem();
  
  // Загружает конфигурацию с сервера по ID
  ps.initWithPreset('my-canvas', 'preset-123', {
    apiUrl: 'https://api.particle-site.com'
  });
</script>
```

пример работающей интеграции можно посмотреть в test_import.html

## Поведения

| Поведение | Описание |
|:----------|:---------|
| `followMouse` | Частицы следуют за курсором |
| `gravity` | Частицы притягиваются к центру (зажми ЛКМ и двигай) |
| `repulse` | Частицы отталкиваются от курсора |
| `magneticField` | Магнитное поле + притяжение к курсору |
| `vortex` | Вихрь вокруг курсора |
| `wave` | Волновое движение |
| `explosion` | Взрыв при клике |

---

## Параметры конфигурации

```typescript
interface ParticleConfig {
  particleCount: number;    // количество частиц (100–15000)
  colors: string[];         // цвета частиц (HEX)
  particleSize: number;     // размер частиц (2–10)
  maxSpeed: number;         // начальная скорость
  behavior: string;         // поведение (см. выше)
  shape?: 'square' | 'circle' | 'triangle';
  initSpeed?: number;       // начальная скорость
}
```

---

## Загрузка пресета с сервера

```typescript
ps.initWithPreset('my-canvas', 'preset-123', {
  apiUrl: 'https://api.particle-site.com'
});
```

---

## Методы API

| Метод | Описание |
|:------|:---------|
| `init(config)` | Инициализация визуализации |
| `setBehavior(name, params)` | Смена поведения |
| `setTargetFps(fps)` | Установка целевого FPS |
| `setBackgroundColor(color)` | Цвет фона |
| `setBorderRadius(radius)` | Скругление углов |
| `setCanvasSize(width, height)` | Размер холста |
| `destroy()` | Остановка и очистка |

---

## Сборка

```bash
npm install
npm run build
```

---

**Автор:** [Михалькевич Владислав](https://github.com/Mihalkevitc)
