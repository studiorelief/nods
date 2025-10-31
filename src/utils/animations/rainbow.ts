interface RainbowCursorOptions {
  element?: HTMLElement;
  length?: number;
  colors?: string[];
  size?: number;
  trailSpeed?: number;
  colorCycleSpeed?: number;
  blur?: number;
  pulseSpeed?: number;
  pulseMin?: number;
  pulseMax?: number;
  exactColors?: boolean; // when true, use provided hex colors without interpolation
}

interface Particle {
  position: { x: number; y: number };
}

class RainbowCursor {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private cursor = { x: 0, y: 0 };
  private particles: Particle[] = [];
  private animationFrameId: number | undefined;
  private cursorsInitted = false;
  private time = 0;

  private options: Required<RainbowCursorOptions>;

  constructor(options: RainbowCursorOptions = {}) {
    this.options = {
      element: options.element as HTMLElement,
      length: options.length ?? 120,
      colors: options.colors ?? ['#DB0617', '#FF883A', '#FF15E6', '#1500FF', '#00E4AE'],
      size: options.size ?? 10,
      trailSpeed: options.trailSpeed ?? 0.4,
      colorCycleSpeed: options.colorCycleSpeed ?? 0.002,
      blur: options.blur ?? 0,
      pulseSpeed: options.pulseSpeed ?? 0.01,
      pulseMin: options.pulseMin ?? 1.2,
      pulseMax: options.pulseMax ?? 1.2,
      exactColors: options.exactColors ?? false,
    };
  }

  private interpolateColors(color1: string, color2: string, factor: number): string {
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);

    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  }

  private getPulseSize(baseSize: number, time: number): number {
    const pulse = Math.sin(time * this.options.pulseSpeed);
    const scaleFactor =
      this.options.pulseMin + ((pulse + 1) * (this.options.pulseMax - this.options.pulseMin)) / 2;
    return baseSize * scaleFactor;
  }

  private onMouseMove = (e: MouseEvent): void => {
    const hasWrapperEl = this.options.element !== undefined;

    if (hasWrapperEl && this.options.element) {
      const boundingRect = this.options.element.getBoundingClientRect();
      this.cursor.x = e.clientX - boundingRect.left;
      this.cursor.y = e.clientY - boundingRect.top;
    } else {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    }

    if (!this.cursorsInitted) {
      this.cursorsInitted = true;
      for (let i = 0; i < this.options.length; i++) {
        this.particles.push({
          position: { x: this.cursor.x, y: this.cursor.y },
        });
      }
    }
  };

  private onWindowResize = (): void => {
    const hasWrapperEl = this.options.element !== undefined;

    if (hasWrapperEl && this.options.element && this.canvas) {
      this.canvas.width = this.options.element.clientWidth;
      this.canvas.height = this.options.element.clientHeight;
    } else if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  };

  private updateParticles = (): void => {
    if (!this.context || !this.canvas) return;

    const { context: ctx } = this;
    const { canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';

    if (this.options.blur > 0) {
      ctx.filter = `blur(${this.options.blur}px)`;
    }

    const particleSets: { x: number; y: number }[] = [];
    let { x } = this.cursor;
    let { y } = this.cursor;

    this.particles.forEach((particle, index) => {
      const nextParticle = this.particles[index + 1] || this.particles[0];

      particle.position.x = x;
      particle.position.y = y;

      particleSets.push({ x, y });

      x += (nextParticle.position.x - particle.position.x) * this.options.trailSpeed;
      y += (nextParticle.position.y - particle.position.y) * this.options.trailSpeed;
    });

    // Time-based color cycling (disabled when exactColors is true)
    if (!this.options.exactColors) {
      this.time += this.options.colorCycleSpeed;
    }
    const colorOffset = this.options.exactColors ? 0 : this.time % 1;

    // Dynamic size based on pulse
    const currentSize = this.getPulseSize(this.options.size, this.time);

    this.options.colors.forEach((color, index) => {
      const nextColor = this.options.colors[(index + 1) % this.options.colors.length];

      ctx.beginPath();
      ctx.strokeStyle = this.options.exactColors
        ? color
        : this.interpolateColors(
            color,
            nextColor,
            (index + colorOffset) / this.options.colors.length
          );

      if (particleSets.length) {
        ctx.moveTo(particleSets[0].x, particleSets[0].y + index * (currentSize - 1));
      }

      particleSets.forEach((set, particleIndex) => {
        if (particleIndex !== 0) {
          ctx.lineTo(set.x, set.y + index * currentSize);
        }
      });

      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  };

  private loop = (): void => {
    this.updateParticles();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public init(): void {
    const hasWrapperEl = this.options.element !== undefined;
    const targetElement = hasWrapperEl ? this.options.element : document.body;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      // eslint-disable-next-line no-console
      console.log('Reduced motion is enabled - cursor animation disabled');
      return;
    }

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d', { alpha: true });

    if (!this.context) return;

    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.position = hasWrapperEl ? 'absolute' : 'fixed';
    this.canvas.style.zIndex = '0';

    if (hasWrapperEl && this.options.element) {
      this.options.element.appendChild(this.canvas);
      this.canvas.width = this.options.element.clientWidth;
      this.canvas.height = this.options.element.clientHeight;
    } else {
      document.body.appendChild(this.canvas);
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    targetElement.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onWindowResize);
    this.loop();
  }

  public destroy(): void {
    if (this.canvas) {
      this.canvas.remove();
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const hasWrapperEl = this.options.element !== undefined;
    const targetElement = hasWrapperEl ? this.options.element : document.body;

    targetElement.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onWindowResize);
  }
}

// Function to initialize rainbow cursor for a specific element
export const initRainbowCursor = (selector: string = '.section_home_where'): void => {
  const sectionElement = document.querySelector(selector) as HTMLElement;

  if (sectionElement) {
    const rainbowCursor = new RainbowCursor({
      element: sectionElement,
      length: 120,
      colors: ['#DB0617', '#ff883a', '#FF15E6', '#1500FF', '#00E4AE'],
      size: 12.5,
      trailSpeed: 0.4,
      colorCycleSpeed: 0.002,
      blur: 0,
      pulseSpeed: 0.01,
      pulseMin: 1.2,
      pulseMax: 1.2,
      exactColors: true,
    });

    rainbowCursor.init();

    // Store reference for potential cleanup
    (window as Window & { rainbowCursor?: RainbowCursor }).rainbowCursor = rainbowCursor;
  }
};

export { RainbowCursor };
