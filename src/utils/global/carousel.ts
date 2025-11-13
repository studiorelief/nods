/*
 *============================================================================
 * UNIFIED CAROUSEL UTILITIES (Webflow component + CMS)
 * Optimized for Barba.js compatibility with proper cleanup
 *============================================================================
 *
 * Crée des carousels en mode marquee (défilement infini) avec vitesse constante.
 * Tous les marquees défilent à la même vitesse peu importe leur contenu.
 *
 * @example Usage basique
 * ```typescript
 * import { initLoopWordSwiper, initLoopStudiosSwiper } from './carousel';
 *
 * // Initialiser tous les carousels de mots
 * initLoopWordSwiper();
 *
 * // Initialiser avec un sélecteur personnalisé
 * initLoopWordSwiper({ rootSelector: '.my-custom-carousel' });
 * ```
 *
 * @example Avec Barba.js
 * ```typescript
 * import { destroyAllCarousels } from './carousel';
 *
 * barba.hooks.beforeLeave(() => {
 *   // Détruire avec délai pour correspondre à l'animation de sortie
 *   destroyAllCarousels(350);
 * });
 * ```
 *
 * @features
 * - Vitesse constante pour tous les marquees (PIXELS_PER_SECOND)
 * - Nettoyage automatique des clones lors de la réinitialisation
 * - Gestion propre des instances pour Barba.js
 * - Responsive avec recalcul automatique
 *
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

type InitOptions = {
  rootSelector: string;
};

const BASE_SPACE = 16 * 1.25;
const PIXELS_PER_SECOND = 50; // Vitesse constante en pixels/seconde pour tous les marquees
const DUPLICATION_MULTIPLIER = 4; // Multiplier pour assurer un loop fluide
const MAX_DUPLICATION_ITERATIONS = 100; // Limite de sécurité pour la duplication

// Store instances globally for cleanup
const swiperInstances = new Map<HTMLElement, Swiper>();
let destroyTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Nettoie tous les clones précédents dans le wrapper
 */
function cleanupClones(wrapper: HTMLElement): void {
  const clones = wrapper.querySelectorAll('[data-cloned="true"]');
  clones.forEach((clone) => clone.remove());
}

/**
 * Duplique les slides jusqu'à ce que le wrapper soit assez large pour un loop fluide
 */
function duplicateUntilWideEnough(root: HTMLElement, wrapper: HTMLElement): void {
  // Nettoyer les anciens clones avant de dupliquer (important pour Barba.js)
  cleanupClones(wrapper);

  const originalSlides = Array.from(wrapper.children).filter(
    (slide) => !slide.hasAttribute('data-cloned')
  ) as HTMLElement[];
  const originalCount = originalSlides.length;
  if (originalCount === 0) return;

  // Calculer la largeur cible pour un loop fluide
  const targetWidth = Math.max(window.innerWidth, root.clientWidth) * DUPLICATION_MULTIPLIER;
  let safety = 0;

  while (wrapper.scrollWidth < targetWidth && safety < MAX_DUPLICATION_ITERATIONS) {
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true) as HTMLElement;
      // Marquer les clones pour cleanup ultérieur
      clone.setAttribute('data-cloned', 'true');
      wrapper.appendChild(clone);
    });
    // Force reflow pour mettre à jour scrollWidth
    void wrapper.offsetWidth;
    safety += 1;
  }
}

/**
 * Calcule la durée de transition pour maintenir une vitesse constante
 * Vitesse constante = même nombre de pixels par seconde, peu importe la longueur du contenu
 */
function computeSpeedForConstantVelocity(wrapper: HTMLElement): number {
  const slideWidth = wrapper.querySelector('.swiper-slide')?.clientWidth || 0;
  if (slideWidth === 0) return 5000; // Fallback

  // Calculer le temps nécessaire pour parcourir UN slide à vitesse constante
  const timePerSlide = ((slideWidth + BASE_SPACE) / PIXELS_PER_SECOND) * 1000;

  return Math.max(1000, Math.round(timePerSlide));
}

/**
 * Détruit proprement une instance Swiper
 */
function destroySwiperInstance(root: HTMLElement): void {
  const instance = swiperInstances.get(root);
  if (instance) {
    try {
      instance.destroy(true, true);
    } catch (e) {
      // Silently catch errors during Swiper destruction
      // En production, on ignore les erreurs pour éviter de polluer la console
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error('Error destroying Swiper instance:', e);
      }
    }
    swiperInstances.delete(root);
  }
}

/**
 * Initialise un swiper en mode marquee pour un élément root
 */
function initLoopSwiperForRoot(root: HTMLElement): void {
  // Nettoyer l'instance existante si elle existe (important pour Barba.js)
  destroySwiperInstance(root);

  const wrapper = root.querySelector('.swiper-wrapper') as HTMLElement | null;
  if (!wrapper) return;

  // S'assurer que le wrapper a du contenu
  const slides = wrapper.querySelectorAll('.swiper-slide');
  if (slides.length === 0) return;

  // Dupliquer les slides pour un loop fluide
  duplicateUntilWideEnough(root, wrapper);

  // Calculer la vitesse pour que tous les marquees aillent à la même vitesse
  const speed = computeSpeedForConstantVelocity(wrapper);

  // Initialiser Swiper
  const swiper = new Swiper(root, {
    direction: 'horizontal',
    loop: true,
    centeredSlides: true,
    speed,
    spaceBetween: BASE_SPACE,
    slidesPerView: 'auto',
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    freeMode: false,
    grabCursor: false,
    allowTouchMove: false,
    mousewheel: false,
    keyboard: false,
    passiveListeners: true,
    watchSlidesProgress: false,
    preventInteractionOnTransition: true,
  });

  // Stocker l'instance pour cleanup ultérieur
  swiperInstances.set(root, swiper);

  // Forcer le timing linéaire pour un mouvement constant
  const { wrapperEl } = swiper as unknown as { wrapperEl?: HTMLElement };
  if (wrapperEl) {
    wrapperEl.style.transitionTimingFunction = 'linear';
  }

  // Gérer le resize avec recalcul de la vitesse
  let resizeTimeout: ReturnType<typeof setTimeout>;
  swiper.on('resize', (s) => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { wrapperEl: we } = s as unknown as { wrapperEl?: HTMLElement };
      if (we) {
        we.style.transitionTimingFunction = 'linear';
      }
      // Recalculer la vitesse pour maintenir la vélocité constante
      const newSpeed = computeSpeedForConstantVelocity(wrapper);
      (s.params as unknown as { speed: number }).speed = newSpeed;
      s.update();
    }, 150);
  });
}

/**
 * Initialise les marquees de mots (loop word)
 *
 * @param options - Options d'initialisation
 * @param options.rootSelector - Sélecteur CSS des éléments Swiper à initialiser
 *
 * @example
 * ```typescript
 * // Utilisation avec le sélecteur par défaut
 * initLoopWordSwiper();
 *
 * // Utilisation avec un sélecteur personnalisé
 * initLoopWordSwiper({ rootSelector: '.my-words-carousel' });
 * ```
 */
export function initLoopWordSwiper(
  options: InitOptions = { rootSelector: '.swiper.is-loop-word' }
): void {
  const swipers = document.querySelectorAll(options.rootSelector);
  if (swipers.length === 0) return;

  swipers.forEach((el) => {
    if (el instanceof HTMLElement) {
      initLoopSwiperForRoot(el);
    }
  });
}

/**
 * Initialise les marquees de studios
 *
 * @param options - Options d'initialisation
 * @param options.rootSelector - Sélecteur CSS des éléments Swiper à initialiser
 *
 * @example
 * ```typescript
 * // Utilisation avec le sélecteur par défaut
 * initLoopStudiosSwiper();
 *
 * // Utilisation avec un sélecteur personnalisé
 * initLoopStudiosSwiper({ rootSelector: '.my-studios-carousel' });
 * ```
 */
export function initLoopStudiosSwiper(
  options: InitOptions = { rootSelector: '.swiper.is-studios-loop' }
): void {
  const swipers = document.querySelectorAll(options.rootSelector);
  if (swipers.length === 0) return;

  swipers.forEach((el) => {
    if (el instanceof HTMLElement) {
      initLoopSwiperForRoot(el);
    }
  });
}

/**
 * Détruit toutes les instances Swiper actives
 *
 * À appeler avant les transitions Barba.js pour éviter les glitches visuels.
 * Le délai permet de synchroniser la destruction avec l'animation de sortie.
 *
 * @param delay - Délai en millisecondes avant de détruire (défaut: 0)
 *
 * @example Sans délai (destruction immédiate)
 * ```typescript
 * destroyAllCarousels();
 * ```
 *
 * @example Avec délai pour correspondre à une animation de 500ms
 * ```typescript
 * barba.hooks.beforeLeave(() => {
 *   // Détruire à 350ms quand l'opacité est à ~30%
 *   destroyAllCarousels(350);
 * });
 * ```
 */
export function destroyAllCarousels(delay: number = 0): void {
  // Clear any pending destroy timeout pour éviter les conflits
  if (destroyTimeout) {
    clearTimeout(destroyTimeout);
    destroyTimeout = null;
  }

  const performDestroy = () => {
    swiperInstances.forEach((swiper, root) => {
      destroySwiperInstance(root);
    });
    destroyTimeout = null;
  };

  if (delay > 0) {
    destroyTimeout = setTimeout(performDestroy, delay);
  } else {
    performDestroy();
  }
}

export default {
  initLoopWordSwiper,
  initLoopStudiosSwiper,
  destroyAllCarousels,
};
