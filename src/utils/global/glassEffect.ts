/*
 * Glass Surface Effect - Effet glassmorphism avancé avec distorsion chromatique
 * Adapté de https://reactbits.dev/components/glass-surface
 */

interface GlassConfig {
  borderRadius: number;
  borderWidth: number;
  brightness: number;
  opacity: number;
  blur: number;
  displace: number;
  backgroundOpacity: number;
  saturation: number;
  distortionScale: number;
  redOffset: number;
  greenOffset: number;
  blueOffset: number;
  xChannel: 'R' | 'G' | 'B';
  yChannel: 'R' | 'G' | 'B';
  mixBlendMode: string;
}

const defaultConfig: GlassConfig = {
  borderRadius: 20,
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0,
  backgroundOpacity: 0.05,
  saturation: 1,
  distortionScale: -90,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
  xChannel: 'R',
  yChannel: 'G',
  mixBlendMode: 'difference',
};

// Stocker les éléments initialisés
const glassElements = new Map<
  HTMLElement,
  {
    config: GlassConfig;
    filterId: string;
    svgElement: SVGSVGElement;
    feImageRef: SVGFEImageElement;
    redChannelRef: SVGFEDisplacementMapElement;
    greenChannelRef: SVGFEDisplacementMapElement;
    blueChannelRef: SVGFEDisplacementMapElement;
    gaussianBlurRef: SVGFEGaussianBlurElement;
    resizeObserver: ResizeObserver;
  }
>();

let uniqueId = 0;

function generateUniqueId(): string {
  // Use Date.now which is monotonic and less likely to have collisions in SSR or hydration
  // eslint-disable-next-line
  return `glass-filter-${++uniqueId}-${Date.now()}`;
}

function supportsSVGFilters(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  if (isWebkit || isFirefox) {
    return false;
  }

  const div = document.createElement('div');
  div.style.backdropFilter = 'url(#test-filter)';
  return div.style.backdropFilter !== '';
}

function generateDisplacementMap(
  element: HTMLElement,
  config: GlassConfig,
  filterId: string
): string {
  const rect = element.getBoundingClientRect();
  const actualWidth = rect.width || 400;
  const actualHeight = rect.height || 200;
  const edgeSize = Math.min(actualWidth, actualHeight) * (config.borderWidth * 0.5);

  const redGradId = `red-grad-${filterId}`;
  const blueGradId = `blue-grad-${filterId}`;

  const svgContent = `
    <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${config.borderRadius}" fill="url(#${redGradId})" />
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${config.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${config.mixBlendMode}" />
      <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${config.borderRadius}" fill="hsl(0 0% ${config.brightness}% / ${config.opacity})" style="filter:blur(${config.blur}px)" />
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function createSVGFilter(filterId: string): {
  svg: SVGSVGElement;
  feImage: SVGFEImageElement;
  redChannel: SVGFEDisplacementMapElement;
  greenChannel: SVGFEDisplacementMapElement;
  blueChannel: SVGFEDisplacementMapElement;
  gaussianBlur: SVGFEGaussianBlurElement;
} {
  const svgNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'glass-surface__filter');
  svg.setAttribute('xmlns', svgNS);
  svg.style.cssText = `
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    inset: 0;
    opacity: 0;
    z-index: -1;
  `;

  const defs = document.createElementNS(svgNS, 'defs');
  const filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', filterId);
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '0%');
  filter.setAttribute('y', '0%');
  filter.setAttribute('width', '100%');
  filter.setAttribute('height', '100%');

  // feImage
  const feImage = document.createElementNS(svgNS, 'feImage');
  feImage.setAttribute('x', '0');
  feImage.setAttribute('y', '0');
  feImage.setAttribute('width', '100%');
  feImage.setAttribute('height', '100%');
  feImage.setAttribute('preserveAspectRatio', 'none');
  feImage.setAttribute('result', 'map');

  // Red channel
  const redChannel = document.createElementNS(svgNS, 'feDisplacementMap');
  redChannel.setAttribute('in', 'SourceGraphic');
  redChannel.setAttribute('in2', 'map');
  redChannel.setAttribute('result', 'dispRed');

  const redMatrix = document.createElementNS(svgNS, 'feColorMatrix');
  redMatrix.setAttribute('in', 'dispRed');
  redMatrix.setAttribute('type', 'matrix');
  redMatrix.setAttribute('values', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0');
  redMatrix.setAttribute('result', 'red');

  // Green channel
  const greenChannel = document.createElementNS(svgNS, 'feDisplacementMap');
  greenChannel.setAttribute('in', 'SourceGraphic');
  greenChannel.setAttribute('in2', 'map');
  greenChannel.setAttribute('result', 'dispGreen');

  const greenMatrix = document.createElementNS(svgNS, 'feColorMatrix');
  greenMatrix.setAttribute('in', 'dispGreen');
  greenMatrix.setAttribute('type', 'matrix');
  greenMatrix.setAttribute('values', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0');
  greenMatrix.setAttribute('result', 'green');

  // Blue channel
  const blueChannel = document.createElementNS(svgNS, 'feDisplacementMap');
  blueChannel.setAttribute('in', 'SourceGraphic');
  blueChannel.setAttribute('in2', 'map');
  blueChannel.setAttribute('result', 'dispBlue');

  const blueMatrix = document.createElementNS(svgNS, 'feColorMatrix');
  blueMatrix.setAttribute('in', 'dispBlue');
  blueMatrix.setAttribute('type', 'matrix');
  blueMatrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0');
  blueMatrix.setAttribute('result', 'blue');

  // Blend
  const blendRG = document.createElementNS(svgNS, 'feBlend');
  blendRG.setAttribute('in', 'red');
  blendRG.setAttribute('in2', 'green');
  blendRG.setAttribute('mode', 'screen');
  blendRG.setAttribute('result', 'rg');

  const blendRGB = document.createElementNS(svgNS, 'feBlend');
  blendRGB.setAttribute('in', 'rg');
  blendRGB.setAttribute('in2', 'blue');
  blendRGB.setAttribute('mode', 'screen');
  blendRGB.setAttribute('result', 'output');

  // Gaussian blur
  const gaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
  gaussianBlur.setAttribute('in', 'output');
  gaussianBlur.setAttribute('stdDeviation', '0.7');

  // Assemble filter
  filter.appendChild(feImage);
  filter.appendChild(redChannel);
  filter.appendChild(redMatrix);
  filter.appendChild(greenChannel);
  filter.appendChild(greenMatrix);
  filter.appendChild(blueChannel);
  filter.appendChild(blueMatrix);
  filter.appendChild(blendRG);
  filter.appendChild(blendRGB);
  filter.appendChild(gaussianBlur);

  defs.appendChild(filter);
  svg.appendChild(defs);

  return {
    svg,
    feImage,
    redChannel,
    greenChannel,
    blueChannel,
    gaussianBlur,
  };
}

function setupGlassElement(element: HTMLElement, config: GlassConfig) {
  const filterId = generateUniqueId();
  const svgSupported = supportsSVGFilters();

  // Créer le filtre SVG
  const { svg, feImage, redChannel, greenChannel, blueChannel, gaussianBlur } =
    createSVGFilter(filterId);

  // Insérer le SVG dans l'élément
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.insertBefore(svg, element.firstChild);

  // Fonction de mise à jour du displacement map
  const updateDisplacementMap = () => {
    feImage.setAttribute('href', generateDisplacementMap(element, config, filterId));
  };

  // Configurer les displacement channels
  const channels = [
    { ref: redChannel, offset: config.redOffset },
    { ref: greenChannel, offset: config.greenOffset },
    { ref: blueChannel, offset: config.blueOffset },
  ];

  channels.forEach(({ ref, offset }) => {
    ref.setAttribute('scale', (config.distortionScale + offset).toString());
    ref.setAttribute('xChannelSelector', config.xChannel);
    ref.setAttribute('yChannelSelector', config.yChannel);
  });

  gaussianBlur.setAttribute('stdDeviation', config.displace.toString());

  // Initialiser le displacement map
  updateDisplacementMap();

  // Appliquer les styles
  if (svgSupported) {
    element.classList.add('glass-surface--svg');
    element.style.setProperty('--glass-frost', config.backgroundOpacity.toString());
    element.style.setProperty('--glass-saturation', config.saturation.toString());
    element.style.setProperty('--filter-id', `url(#${filterId})`);
  } else {
    element.classList.add('glass-surface--fallback');
  }

  // Observer les changements de taille
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(updateDisplacementMap, 0);
  });
  resizeObserver.observe(element);

  // Stocker les références
  glassElements.set(element, {
    config,
    filterId,
    svgElement: svg,
    feImageRef: feImage,
    redChannelRef: redChannel,
    greenChannelRef: greenChannel,
    blueChannelRef: blueChannel,
    gaussianBlurRef: gaussianBlur,
    resizeObserver,
  });
}

function parseConfig(element: HTMLElement): GlassConfig {
  return {
    borderRadius: parseFloat(element.dataset.glassBorderRadius || '') || defaultConfig.borderRadius,
    borderWidth: parseFloat(element.dataset.glassBorderWidth || '') || defaultConfig.borderWidth,
    brightness: parseFloat(element.dataset.glassBrightness || '') || defaultConfig.brightness,
    opacity: parseFloat(element.dataset.glassOpacity || '') || defaultConfig.opacity,
    blur: parseFloat(element.dataset.glassBlur || '') || defaultConfig.blur,
    displace: parseFloat(element.dataset.glassDisplace || '') || defaultConfig.displace,
    backgroundOpacity:
      parseFloat(element.dataset.glassBackgroundOpacity || '') || defaultConfig.backgroundOpacity,
    saturation: parseFloat(element.dataset.glassSaturation || '') || defaultConfig.saturation,
    distortionScale:
      parseFloat(element.dataset.glassDistortionScale || '') || defaultConfig.distortionScale,
    redOffset: parseFloat(element.dataset.glassRedOffset || '') || defaultConfig.redOffset,
    greenOffset: parseFloat(element.dataset.glassGreenOffset || '') || defaultConfig.greenOffset,
    blueOffset: parseFloat(element.dataset.glassBlueOffset || '') || defaultConfig.blueOffset,
    xChannel: (element.dataset.glassXChannel as 'R' | 'G' | 'B') || defaultConfig.xChannel,
    yChannel: (element.dataset.glassYChannel as 'R' | 'G' | 'B') || defaultConfig.yChannel,
    mixBlendMode: element.dataset.glassMixBlendMode || defaultConfig.mixBlendMode,
  };
}

export function initGlassEffect() {
  const glassLightElements = document.querySelectorAll<HTMLElement>("[decorative='glasseffect']");

  glassLightElements.forEach((element) => {
    // Éviter de réinitialiser
    if (glassElements.has(element)) return;

    const config = parseConfig(element);
    setupGlassElement(element, config);
  });
}

export function destroyGlassEffect() {
  glassElements.forEach((data, element) => {
    data.resizeObserver.disconnect();
    data.svgElement.remove();
    element.classList.remove('glass-surface--svg', 'glass-surface--fallback');
    element.style.removeProperty('--glass-frost');
    element.style.removeProperty('--glass-saturation');
    element.style.removeProperty('--filter-id');
  });
  glassElements.clear();
}
