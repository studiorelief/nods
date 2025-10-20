import './index.css';

import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import gsap from 'gsap';

import { barbaLogoRotate } from '$utils/animations/barba/barbaLogoRotate';
import { resetVideos } from '$utils/animations/barba/barbaResetVideo';
import { initLoopStudiosSwiper, initLoopWordSwiper } from '$utils/animations/carousel';
import { animFooter } from '$utils/animations/footerAnimation';
import { initHeartBeat } from '$utils/animations/heartBeat';
import { initNetworkGradiant } from '$utils/animations/networkGradient';
import { initRainbowCursor } from '$utils/animations/rainbow';
import { whyAssetAnimations } from '$utils/animations/whyAnimations';
import { worksMouse } from '$utils/animations/worksMouse';

// Variable pour stocker la fonction de nettoyage de worksMouse
let cleanupWorksMouse: (() => void) | null = null;

// Group all page enhancements to call on first load and after Barba navigations
const initGlobalFunctions = (): void => {
  initLoopWordSwiper();
  resetVideos();
  barbaLogoRotate();
  animFooter();
  initHeartBeat();
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
            data.next.container.style.willChange = '';
            data.next.container.style.pointerEvents = '';
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
      namespace: 'works',
      beforeEnter() {
        // Nettoyer l'animation précédente si elle existe
        if (cleanupWorksMouse) {
          cleanupWorksMouse();
          cleanupWorksMouse = null;
        }
        // Démarrer la nouvelle animation
        cleanupWorksMouse = worksMouse();
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
});
