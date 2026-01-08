import './footer-scroll-animation.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Initialise l'animation de scroll du footer (effet de rotation circulaire)
 * Basé sur l'extrait fourni utilisant GSAP ScrollTrigger.
 *
 * Structure DOM attendue :
 * - `.footer-2_scroll` : conteneur racine
 * - `.footer-2_assets` : élément qui déclenche le pin (pin-height)
 * - `.footer-2_container` : élément qui est épinglé (container)
 * - `.footer-2_media-wrapper` : wrappers des médias qui tournent
 * - `.footer-2_media` : médias individuels
 */
export const initFooterScrollAnimation = (): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const root = document.querySelector('.footer-2_scroll') as HTMLElement | null;
  if (!root) {
    console.error('[FooterScrollAnimation] .footer-2_scroll not found');
    return () => {};
  }

  // Évite les ré-initialisations multiples
  if (root.dataset.footerScrollAnimInited === 'true') {
    console.error('[FooterScrollAnimation] Already initialized');
    return () => {};
  }
  root.dataset.footerScrollAnimInited = 'true';

  const pinHeight = root.querySelector('.footer-2_assets') as HTMLElement | null;
  const container = root.querySelector('.footer-2_container') as HTMLElement | null;
  const mediaWrappers = Array.from(root.querySelectorAll('.footer-2_media-wrapper'));
  const medias = Array.from(root.querySelectorAll('.footer-2_media'));

  console.error('[FooterScrollAnimation] Elements found:', {
    root: !!root,
    pinHeight: !!pinHeight,
    container: !!container,
    mediaWrappers: mediaWrappers.length,
    medias: medias.length,
  });

  if (!pinHeight || !container || mediaWrappers.length === 0) {
    console.error('[FooterScrollAnimation] Missing required elements:', {
      pinHeight: !pinHeight,
      container: !container,
      mediaWrappers: mediaWrappers.length === 0,
    });
    return () => {};
  }

  // Configuration initiale du container
  gsap.set(container, {
    y: '-50vh', // Position initiale
  });

  // Animation séparée du container de y: -50vh à y: 50vh
  const containerAnimation = gsap.to(container, {
    y: '50vh', // Position finale
    ease: 'power1.out',
    scrollTrigger: {
      trigger: root,
      start: '0% top',
      end: 'bottom bottom',
      scrub: true, // Progression avec le scroll
      markers: true, // Debug markers
    },
  });

  // Configuration initiale des rotations
  const mediasLength = mediaWrappers.length;
  const angle = 360 / mediasLength;

  mediaWrappers.forEach((wrapper, index) => {
    // Assigner l'angle à chaque wrapper
    gsap.set(wrapper, {
      rotation: -angle * index,
      transformOrigin: 'center center',
    });
    // Assigner l'angle opposé à l'enfant du wrapper
    // Position initiale : tous les médias commencent à x: 60vw (hors écran à droite)
    if (medias[index]) {
      gsap.set(medias[index], {
        rotation: angle * index,
        transformOrigin: 'center center',
        autoAlpha: 1, // S'assurer qu'ils sont visibles au début
        x: '60vw', // Position X initiale (tous à la même position)
        y: 0, // Position Y initiale
      });
    }
  });

  // Timeline principale avec scroll trigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pinHeight,
      start: '-25% top',
      end: 'bottom bottom',
      scrub: true, // Progression avec le scroll
      markers: true, // Debug markers
    },
  });

  console.error('[FooterScrollAnimation] Animation initialized successfully');

  tl.to(mediaWrappers, {
    rotation: '+=180', // += ajoute 180 à l'angle actuel
    stagger: 0.04, // Délai d'animation entre chaque élément
    ease: 'power1.out', // Non-linéaire
  });

  tl.to(
    medias,
    {
      x: 0, // Re-centre l'enfant
      rotation: '-=180', // -= soustrait 180 de l'angle actuel
      ease: 'power1.out',
      stagger: 0.04, // Délai d'animation entre chaque élément
    },
    '<' // L'animation commence au début du tween précédent
  );

  tl.from(
    medias,
    {
      autoAlpha: 0, // L'élément est initialement invisible et caché
      duration: 0.03, // Joue rapidement
      stagger: 0.04, // Délai d'animation entre chaque élément
    },
    '<' // L'animation commence au début du tween précédent
  );

  // Fonction de nettoyage
  const cleanup = (): void => {
    // Réinitialiser le dataset si l'élément existe encore
    if (root && root.dataset) {
      root.dataset.footerScrollAnimInited = 'false';
    }
    if (containerAnimation) {
      const trigger = containerAnimation.scrollTrigger;
      if (trigger) trigger.kill(true);
      containerAnimation.kill();
    }
    tl.kill();
    // Tuer tous les ScrollTriggers liés à cette animation
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars?.trigger === root || trigger.vars?.trigger === pinHeight) {
        trigger.kill(true);
      }
    });
    // Nettoyer les animations GSAP si les éléments existent encore
    if (mediaWrappers.length > 0 || medias.length > 0 || container) {
      gsap.killTweensOf([...mediaWrappers, ...medias, container].filter(Boolean));
      gsap.set([...mediaWrappers, ...medias, container].filter(Boolean), { clearProps: 'all' });
    }
  };

  return cleanup;
};

export default initFooterScrollAnimation;
