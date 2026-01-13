import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialise l'animation de scroll pour les liens du footer
 * Animation avec stagger : opacité 0 -> 1 et x -100% -> 0%
 *
 * Structure DOM attendue :
 * - `.footer_links-wrapper` : trigger
 * - `.footer_links-wrapper .nav-2_menu-side_link-wrapper` : éléments à animer
 */
export const initFooterLinksScroll = (): (() => void) => {
  // Respecte les préférences d'accessibilité
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const trigger = document.querySelector('.footer_links-wrapper') as HTMLElement | null;
  if (!trigger) {
    console.error('[FooterLinksScroll] .footer_links-wrapper not found');
    return () => {};
  }

  // Évite les ré-initialisations multiples
  if (trigger.dataset.footerLinksScrollInited === 'true') {
    console.error('[FooterLinksScroll] Already initialized');
    return () => {};
  }
  trigger.dataset.footerLinksScrollInited = 'true';

  const elements = gsap.utils.toArray<HTMLElement>(trigger.querySelectorAll('.nav-2_menu_link'));

  if (elements.length === 0) {
    console.error('[FooterLinksScroll] No .nav-2_menu-side_link-wrapper elements found');
    return () => {};
  }

  // Configuration initiale des éléments (état de départ)
  gsap.set(elements, {
    opacity: 0,
    x: '100%',
  });

  // Animation avec ScrollTrigger et stagger
  // Anime vers opacity: 1, x: 0% avec un délai entre chaque élément
  const animation = gsap.to(elements, {
    opacity: 1,
    x: '0%',
    duration: 0.6,
    ease: 'power2.out',
    stagger: {
      each: 0.1, // Délai de 0.1s entre chaque élément
      from: 'start', // Commence par le premier élément
    },
    scrollTrigger: {
      trigger: trigger,
      start: '50% 85%',
      toggleActions: 'play none none reverse',
      markers: false,
    },
  });

  // Fonction de nettoyage
  const cleanup = (): void => {
    // Réinitialiser le dataset si l'élément existe encore
    if (trigger && trigger.dataset) {
      trigger.dataset.footerLinksScrollInited = 'false';
    }

    // Tuer le ScrollTrigger et l'animation
    if (animation && animation.scrollTrigger) {
      animation.scrollTrigger.kill(true);
    }
    if (animation) {
      animation.kill();
    }

    // Nettoyer les animations GSAP et réinitialiser les propriétés
    if (elements.length > 0) {
      gsap.killTweensOf(elements);
      gsap.set(elements, { clearProps: 'all' });
    }
  };

  return cleanup;
};

export default initFooterLinksScroll;
