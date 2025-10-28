import './index.css';

import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

import { barbaLogoRotate } from '$utils/animations/barba/barbaLogoRotate';
import { resetVideos } from '$utils/animations/barba/barbaResetVideo';
import { initLoopStudiosSwiper, initLoopWordSwiper } from '$utils/animations/carousel';
import { animFooter } from '$utils/animations/footerAnimation';
import { initHeartBeat } from '$utils/animations/heartBeat';
import { initHowSlider } from '$utils/animations/howSlider';
import { initNetworkGradiant } from '$utils/animations/networkGradient';
import { initOtherProjectsSlider } from '$utils/animations/OtherProjectsSlider';
import { initRainbowCursor } from '$utils/animations/rainbow';
import { initWhereProjectsScroll } from '$utils/animations/whereProjectsScroll';
import { initWhoSlider } from '$utils/animations/whoSlider';
import { whyAssetAnimations } from '$utils/animations/whyAnimations';
import { initWhyLetterScroll } from '$utils/animations/whyLetterScroll';
import { worksMouse } from '$utils/animations/worksMouse';
import { loadScript } from '$utils/global/loadScript';
// Variable pour stocker la fonction de nettoyage de worksMouse
let cleanupWorksMouse: (() => void) | null = null;

// Group all page enhancements to call on first load and after Barba navigations
const initGlobalFunctions = (): void => {
  initLoopWordSwiper();
  resetVideos();
  barbaLogoRotate();
  animFooter();
  loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-accordion@1/accordion.js');
};

initGlobalFunctions();

barba.init({
  transitions: [
    {
      name: 'opacity-transition',
      leave(data: { current: { container: HTMLElement } }) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      },
      enter(data: { next: { container: HTMLElement } }) {
        gsap.from(data.next.container, {
          y: -16 * 2,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            // Nettoyer TOUS les styles inline appliqués par GSAP sur le container
            // C'est crucial pour que position: sticky fonctionne
            gsap.set(data.next.container, { clearProps: 'all' });
          },
        });
      },
    },
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        initRainbowCursor();
        initLoopStudiosSwiper();
        whyAssetAnimations();
        initWhoSlider();
        initHowSlider();

        requestAnimationFrame(() => {
          initWhereProjectsScroll();
          initHeartBeat();
        });

        requestAnimationFrame(() => {
          initWhyLetterScroll();
        });
      },
    },
    {
      namespace: 'works',
      beforeEnter() {
        // Nettoyer l'animation précédente si elle existe
        if (cleanupWorksMouse) {
          cleanupWorksMouse();
          cleanupWorksMouse = null;
        }
        // Démarrer la nouvelle animation
        cleanupWorksMouse = worksMouse();
        initWhereProjectsScroll();
      },
    },
    {
      namespace: 'skills',
      beforeEnter() {},
    },
    {
      namespace: 'network',
      beforeEnter() {
        initNetworkGradiant();
      },
    },
    {
      namespace: 'pricings',
      beforeEnter() {},
    },
    {
      namespace: 'projects',
      beforeEnter() {
        restartWebflow();
        initOtherProjectsSlider();
      },
    },
  ],
});

/* 
! Barba Hooks
*/

/* 
! Barba Hooks - Global
*/

barba.hooks.beforeLeave(() => {
  // Kill all ScrollTriggers and reset inline styles
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill(true); // true = revert inline styles
  });

  restartWebflow();
});

barba.hooks.beforeEnter((data: { next: { namespace: string } }) => {
  // Nettoyer l'animation worksMouse seulement si on n'arrive pas sur la page works
  if (cleanupWorksMouse && data.next.namespace !== 'works') {
    cleanupWorksMouse();
    cleanupWorksMouse = null;
  }
});

// Ensure Webflow and custom animations are fully re-initialized
barba.hooks.afterEnter(() => {
  window.scrollTo(0, 0);
  initGlobalFunctions();
  restartWebflow();
  // Refresh ScrollTrigger to recalculate positions after DOM changes
  ScrollTrigger.refresh();
});
