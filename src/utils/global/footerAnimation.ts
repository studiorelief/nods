import gsap from 'gsap';

/**
 * Initialise l'animation du footer (effet carte qui suit la souris)
 * Basé sur l'extrait fourni utilisant gsap.quickTo.
 *
 * Structure DOM attendue à l'intérieur de `rootSelector` :
 * - `.card` : élément animé en position/rotation
 * - `.media` : élément zoomé (scale)
 */
export const animFooter = (rootSelector: string = '.footer-2_content'): (() => void) => {
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

  const card = root.querySelector('.footer-2_cards') as HTMLElement | null;
  const media = root.querySelector('.footer-2_cards-asset') as HTMLElement | null;
  if (!card || !media) return () => {};

  // Récupérer les éléments déclencheurs
  const trigger = document.querySelector('.footer-2_cards-trigger') as HTMLElement | null;
  const navbar = document.querySelector('.nav-2_component') as HTMLElement | null;

  // Préparer la scène 3D et l'origine des transformations
  // Perspective réduite pour un effet 3D plus marqué
  gsap.set(root, { transformPerspective: window.innerWidth / 2 });
  gsap.set(card, {
    transformStyle: 'preserve-3d',
    transformOrigin: '50% 50%',
    overflow: 'hidden', // Masquer les bordures qui dépassent lors de la rotation
  });
  gsap.set(media, {
    backfaceVisibility: 'hidden',
    transformOrigin: '50% 50%',
    transformStyle: 'preserve-3d', // Assurer la cohérence 3D
  });

  const xTo = gsap.quickTo(card, 'x', { duration: 1, ease: 'power4' });
  const yTo = gsap.quickTo(card, 'y', { duration: 1, ease: 'power4' });
  const rotationYTo = gsap.quickTo(card, 'rotationY', { duration: 1, ease: 'power4' });
  const rotationXTo = gsap.quickTo(card, 'rotationX', { duration: 1, ease: 'power4' });
  // L'image suit naturellement la rotation de la carte (pas besoin de rotations séparées)
  // On garde seulement le scale pour l'effet de zoom
  const scaleXTo = gsap.quickTo(media, 'scaleX', { duration: 1, ease: 'power4' });
  const scaleYTo = gsap.quickTo(media, 'scaleY', { duration: 1, ease: 'power4' });

  let isMoving: number | undefined;
  let oldPosX: number | null = null;
  let oldPosY: number | null = null;
  let isMouseInside = false;

  // Fonction pour vérifier si la souris est dans l'un des éléments déclencheurs
  const isMouseInsideTrigger = (x: number, y: number): boolean => {
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return true;
      }
    }
    if (navbar) {
      const rect = navbar.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return true;
      }
    }
    return false;
  };

  const onMouseMove = (e: MouseEvent): void => {
    // Vérifier si la souris est dans l'un des éléments déclencheurs
    const inside = isMouseInsideTrigger(e.clientX, e.clientY);

    // Si on vient de quitter la zone, réinitialiser
    if (isMouseInside && !inside) {
      isMouseInside = false;
      rotationYTo(0);
      rotationXTo(0);
      scaleXTo(1.2);
      scaleYTo(1.2);
      xTo(0);
      yTo(0);
      oldPosX = null;
      oldPosY = null;
      if (isMoving) {
        window.clearTimeout(isMoving);
      }
      return;
    }

    // Si on vient d'entrer dans la zone
    if (!isMouseInside && inside) {
      isMouseInside = true;
      oldPosX = null;
      oldPosY = null;
      return;
    }

    // Ne rien faire si la souris n'est pas dans la section
    if (!isMouseInside) return;

    if (oldPosX === null || oldPosY === null) {
      oldPosX = e.clientX;
      oldPosY = e.clientY;
      return;
    }
    const deltaX = e.clientX - oldPosX;
    const deltaY = e.clientY - oldPosY;

    // Facteur pour amplifier l'effet de rotation 3D
    const rotationFactor = 2.5;
    // On applique la rotation uniquement sur la carte, l'image suivra naturellement
    rotationYTo(deltaX * rotationFactor);
    rotationXTo(-deltaY * rotationFactor);

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
      scaleXTo(1.2);
      scaleYTo(1.2);
    }, 66);
  };

  // Écouter les événements de mouvement de souris globalement
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const cleanup = (): void => {
    window.removeEventListener('mousemove', onMouseMove);
    // Réinitialiser l'état et les transformations pour éviter les résidus entre pages
    root.dataset.animFooterInited = 'false';
    if (isMoving) {
      window.clearTimeout(isMoving);
    }
    gsap.killTweensOf([card, media]);
    gsap.set(card, { x: 0, y: 0, rotationX: 0, rotationY: 0 });
    gsap.set(media, { scaleX: 1, scaleY: 1 });
  };

  return cleanup;
};

export default animFooter;
