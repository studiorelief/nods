import gsap from 'gsap';

/**
 * Initialise l'animation du footer (effet carte qui suit la souris)
 * Basé sur l'extrait fourni utilisant gsap.quickTo.
 *
 * Structure DOM attendue à l'intérieur de `rootSelector` :
 * - `.card` : élément animé en position/rotation
 * - `.media` : élément zoomé (scale)
 */
export const animFooter = (rootSelector: string = '.section_footer'): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  // Animation uniquement sur les écrans > 991px
  const isDesktop = window.matchMedia('(min-width: 992px)');
  if (!isDesktop.matches) return () => {};

  const root = document.querySelector(rootSelector) as HTMLElement | null;
  if (!root) return () => {};

  // Évite les ré-initialisations multiples
  if (root.dataset.animFooterInited === 'true') return () => {};
  root.dataset.animFooterInited = 'true';

  const card = root.querySelector('.footer_cards') as HTMLElement | null;
  const media = root.querySelector('.footer_cards-asset') as HTMLElement | null;
  if (!card || !media) return () => {};

  // Préparer la scène 3D et l'origine des transformations
  // Perspective réduite pour un effet 3D plus marqué
  gsap.set(root, { transformPerspective: window.innerWidth / 2 });
  gsap.set(card, { transformStyle: 'preserve-3d', transformOrigin: '50% 50%' });
  gsap.set(media, { backfaceVisibility: 'hidden', transformOrigin: '50% 50%' });

  const xTo = gsap.quickTo(card, 'x', { duration: 1, ease: 'power4' });
  const yTo = gsap.quickTo(card, 'y', { duration: 1, ease: 'power4' });
  const rotationYTo = gsap.quickTo(card, 'rotationY', { duration: 1, ease: 'power4' });
  const rotationXTo = gsap.quickTo(card, 'rotationX', { duration: 1, ease: 'power4' });
  const scaleXTo = gsap.quickTo(media, 'scaleX', { duration: 2, ease: 'power1' });
  const scaleYTo = gsap.quickTo(media, 'scaleY', { duration: 2, ease: 'power1' });
  const mediaRotationYTo = gsap.quickTo(media, 'rotationY', { duration: 1, ease: 'power4' });
  const mediaRotationXTo = gsap.quickTo(media, 'rotationX', { duration: 1, ease: 'power4' });

  let isMoving: number | undefined;
  let oldPosX: number | null = null;
  let oldPosY: number | null = null;

  const onMouseMove = (e: MouseEvent): void => {
    if (oldPosX === null || oldPosY === null) {
      oldPosX = e.clientX;
      oldPosY = e.clientY;
      return;
    }
    const deltaX = e.clientX - oldPosX;
    const deltaY = e.clientY - oldPosY;

    // Facteur pour amplifier l'effet de rotation 3D
    const rotationFactor = 2.5;
    rotationYTo(deltaX * rotationFactor);
    rotationXTo(-deltaY * rotationFactor);
    mediaRotationYTo(deltaX * rotationFactor);
    mediaRotationXTo(-deltaY * rotationFactor);

    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const currentX = Number(gsap.getProperty(card, 'x')) || 0;
    const currentY = Number(gsap.getProperty(card, 'y')) || 0;

    const targetX = currentX + (e.clientX - cardCenterX);
    const targetY = currentY + (e.clientY - cardCenterY);

    xTo(targetX);
    yTo(targetY);

    scaleXTo(1);
    scaleYTo(1);

    oldPosX = e.clientX;
    oldPosY = e.clientY;

    window.clearTimeout(isMoving);
    isMoving = window.setTimeout(() => {
      rotationYTo(0);
      rotationXTo(0);
      mediaRotationYTo(0);
      mediaRotationXTo(0);
      scaleXTo(1.2);
      scaleYTo(1.2);
    }, 66);
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const cleanup = (): void => {
    window.removeEventListener('mousemove', onMouseMove);
    // Réinitialiser l'état et les transformations pour éviter les résidus entre pages
    root.dataset.animFooterInited = 'false';
    gsap.killTweensOf([card, media]);
    gsap.set(card, { x: 0, y: 0, rotationX: 0, rotationY: 0 });
    gsap.set(media, { rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1 });
  };

  return cleanup;
};

export default animFooter;
