import gsap from 'gsap';

/**
 * Initialise l'animation de hover pour les clients
 * Animation des previews lors du survol des items de la collection
 */
export const initClientsAnimation = (): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const root = document.querySelector('.section_clients .clients_collection-list') as HTMLElement;
  if (!root) return () => {};

  const items = root.querySelectorAll('.clients_cards') as NodeListOf<HTMLElement>;
  if (!items.length) return () => {};

  let lastIndexEntered = 0;
  const tls: gsap.core.Timeline[] = [];
  const eventListeners: Array<{
    element: HTMLElement;
    handler: () => void;
    leaveHandler: () => void;
  }> = [];

  // For each row...
  items.forEach((item, index) => {
    // Get the media of the row
    const medias = item.querySelectorAll('.clients_preview') as NodeListOf<HTMLElement>;
    if (!medias.length) return;

    // Create a timeline() and set it to paused, except for the first row
    const tl = gsap.timeline({ paused: index !== 0 ? true : false });
    tl.to(medias, {
      y: 0, // Center the media
      stagger: {
        each: 0.04, // Each media will appear every 0.04s
        from: 'random', // In a random order
      },
      duration: 0.4,
      ease: 'power4.out',
    });

    tls.push(tl); // Add each timeline to an array

    const handleMouseEnter = () => {
      // Reverse the media of the previously active row
      tls[lastIndexEntered]?.timeScale(3).reverse();
      // Update the index of the last hovered row
      lastIndexEntered = index;

      // Play the timeline of the new active row's media
      tls[index]?.timeScale(1).play();

      // Réduire tous les items à 4rem
      gsap.to(items, {
        height: '4rem',
        duration: 0.2,
        ease: 'power2.inOut',
      });
      // Agrandir l'item survolé à 10rem
      gsap.to(item, {
        height: '10rem',
        duration: 0.2,
        ease: 'power2.inOut',
      });
    };

    const handleMouseLeave = () => {
      // Remettre tous les items à 4rem
      gsap.to(items, {
        // height: 'auto',
        duration: 0.2,
        ease: 'power2.inOut',
      });
    };

    item.addEventListener('mouseenter', handleMouseEnter);
    item.addEventListener('mouseleave', handleMouseLeave);
    eventListeners.push({
      element: item,
      handler: handleMouseEnter,
      leaveHandler: handleMouseLeave,
    });
  });

  // Fonction de cleanup
  const cleanup = (): void => {
    // Supprimer tous les event listeners
    eventListeners.forEach(({ element, handler, leaveHandler }) => {
      element.removeEventListener('mouseenter', handler);
      element.removeEventListener('mouseleave', leaveHandler);
    });

    // Tuer toutes les timelines
    tls.forEach((tl) => {
      tl.kill();
    });

    // Reset les propriétés des items
    items.forEach((item) => {
      gsap.set(item, { clearProps: 'height' });
    });

    // Reset les propriétés des medias
    items.forEach((item) => {
      const medias = item.querySelectorAll('.clients_preview') as NodeListOf<HTMLElement>;
      gsap.set(medias, { clearProps: 'y' });
    });

    tls.length = 0;
    eventListeners.length = 0;
  };

  return cleanup;
};

export default initClientsAnimation;
