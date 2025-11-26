import gsap from 'gsap';

/**
 * Initialise l'animation de hover pour les cartes studios
 * Remplace l'animation CSS qui était glitchy
 */
export const initStudiosHover = (): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const studiosCards = document.querySelectorAll('.studios-loop_cards');
  if (!studiosCards.length) return () => {};

  const animations = new Map<HTMLElement, gsap.core.Timeline>();

  studiosCards.forEach((card) => {
    const hoverWrapper = card.querySelector('.studios-loop_hover-wrapper') as HTMLElement;
    if (!hoverWrapper) return;

    // Création des animations
    const handleMouseEnter = () => {
      // Tuer l'animation précédente si elle existe
      const existingAnim = animations.get(hoverWrapper);
      if (existingAnim) {
        existingAnim.kill();
      }

      // Créer une nouvelle timeline
      const tl = gsap.timeline();
      tl.to(hoverWrapper, {
        opacity: 1,
        y: '-2.5rem',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      animations.set(hoverWrapper, tl);
    };

    const handleMouseLeave = () => {
      // Tuer l'animation précédente si elle existe
      const existingAnim = animations.get(hoverWrapper);
      if (existingAnim) {
        existingAnim.kill();
      }

      // Créer une nouvelle timeline pour le retour
      const tl = gsap.timeline();
      tl.to(hoverWrapper, {
        opacity: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      animations.set(hoverWrapper, tl);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Stocker les listeners pour le cleanup
    (card as HTMLElement).dataset.studiosHoverInited = 'true';
  });

  // Fonction de cleanup
  const cleanup = (): void => {
    studiosCards.forEach((card) => {
      const hoverWrapper = card.querySelector('.studios-loop_hover-wrapper') as HTMLElement;
      if (!hoverWrapper) return;

      // Tuer toutes les animations
      const existingAnim = animations.get(hoverWrapper);
      if (existingAnim) {
        existingAnim.kill();
      }

      // Reset les propriétés
      gsap.set(hoverWrapper, { clearProps: 'all' });

      // Supprimer le marqueur d'initialisation
      delete (card as HTMLElement).dataset.studiosHoverInited;
    });

    animations.clear();
  };

  return cleanup;
};

export default initStudiosHover;
