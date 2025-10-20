import gsap from 'gsap';

/**
 * Initialise l'animation de battement de cœur pour l'élément .home_projects_heart
 * Animation de scale de 0.8 à 1 avec ease elastic.out et durée de 1s en boucle
 */
export const initHeartBeat = (selector: string = '.home_projects_heart'): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const heartElement = document.querySelector(selector) as HTMLElement | null;
  if (!heartElement) return () => {};

  // Évite les ré-initialisations multiples
  if (heartElement.dataset.heartBeatInited === 'true') return () => {};
  heartElement.dataset.heartBeatInited = 'true';

  // Configuration de l'animation
  gsap.set(heartElement, {
    scale: 0.8,
    transformOrigin: 'center center',
  });

  // Création de l'animation en boucle
  const timeline = gsap.timeline({ repeat: -1 });

  timeline.to(heartElement, {
    scale: 1,
    duration: 1,
    ease: 'elastic.out(1, 0.3)',
  });

  const cleanup = (): void => {
    timeline.kill();
    heartElement.dataset.heartBeatInited = 'false';
    gsap.set(heartElement, { scale: 1 });
  };

  return cleanup;
};

export default initHeartBeat;
