import gsap from 'gsap';

/**
 * Initialise l'animation de hover pour les clients
 * Animation des previews lors du survol des items de la collection
 */
export const initClientsAnimation = (): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  // Ne lance l'animation que si la fenêtre est supérieure à 479px
  const isMobile = window.matchMedia('(max-width: 479px)');
  if (isMobile.matches) return () => {};

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

    // Set initial state for all medias to ensure reverse works correctly
    // Medias start hidden (offset down)
    gsap.set(medias, { y: '100%' });

    // Create a timeline() and set it to paused for all rows
    // We'll play the first one manually after a short delay
    const tl = gsap.timeline({ paused: true });
    tl.to(medias, {
      y: 0, // Center the media (make it visible)
      stagger: {
        each: 0.04, // Each media will appear every 0.04s
        from: 'random', // In a random order
      },
      duration: 0.4,
      ease: 'power4.out',
    });

    tls.push(tl); // Add each timeline to an array

    const handleMouseEnter = () => {
      // Only reverse if it's a different row
      if (lastIndexEntered !== index) {
        const prevTl = tls[lastIndexEntered];
        if (prevTl) {
          // Reset timeScale to normal
          prevTl.timeScale(1);
          // If timeline is reversed, we need to reset it first
          if (prevTl.reversed()) {
            // Play forward to reset the reversed state
            prevTl.play();
            // Force it to the end immediately
            prevTl.progress(1);
          }
          // Now reverse with faster speed (only if it has progress)
          if (prevTl.progress() > 0) {
            prevTl.timeScale(3).reverse();
          }
        }
      }

      // Update the index of the last hovered row
      lastIndexEntered = index;

      // Play the timeline of the new active row's media
      const currentTl = tls[index];
      if (currentTl) {
        // Reset timeScale
        currentTl.timeScale(1);
        // If timeline is reversed, reset it to start
        if (currentTl.reversed()) {
          currentTl.play();
          currentTl.progress(0);
        }
        // Play the timeline
        currentTl.play();
      }

      // Réduire tous les items à 4rem
      gsap.to(items, {
        height: '4rem',
        duration: 0.2,
        ease: 'power2.inOut',
      });
      // Agrandir l'item survolé à 10rem
      gsap.to(item, {
        height: window.matchMedia('(max-width: 479px)').matches ? '7rem' : '10rem',
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

  // Play the first timeline after a short delay to ensure all timelines are initialized
  if (tls.length > 0) {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      tls[0]?.play();
    });
  }

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
