import './index.css';

import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

import { initHowSlider } from '$utils/animations/home/howSlider';
import { initCloudLoop } from '$utils/animations/home/introCloudLoop';
import { initIntroParallax } from '$utils/animations/home/introParallax';
import { initHeartBeat } from '$utils/animations/home/whereHeartBeat';
import { initWhereProjectsScroll } from '$utils/animations/home/whereProjectsScroll';
import { initRainbowCursor } from '$utils/animations/home/whereRainbow';
import { initWhoSlider } from '$utils/animations/home/whoSlider';
import { whyAssetAnimations } from '$utils/animations/home/whyAnimations';
import { initNetworkGradiant } from '$utils/animations/network/networkGradient';
import { initProjectsNav } from '$utils/animations/projects/projectsNav';
import { initOtherProjectsSlider } from '$utils/animations/works/OtherProjectsSlider';
import { initWorksParallax } from '$utils/animations/works/parallaxWorks';
import { initShowWorkName } from '$utils/animations/works/showWorkName';
// import { initWhyLetterScroll } from '$utils/animations/whyLetterScroll';
import { worksMouse } from '$utils/animations/works/worksMouse';
import { barbaLogoRotate } from '$utils/barba/barbaLogoRotate';
import { resetVideos } from '$utils/barba/barbaResetVideo';
import { initLoopStudiosSwiper, initLoopWordSwiper } from '$utils/global/carousel';
import { animFooter } from '$utils/global/footerAnimation';
import { loadModelViewerScript } from '$utils/global/loadModalViewer';
import { loadScript } from '$utils/global/loadScript';
import { initMarker } from '$utils/global/marker';
import { closeNavMobile, navMobile } from '$utils/global/navbarMobile';
import { popupContact } from '$utils/global/popupContact';

// Variable pour stocker la fonction de nettoyage de worksMouse
let cleanupWorksMouse: (() => void) | null = null;

// Group all page enhancements to call on first load and after Barba navigations
const initGlobalFunctions = (): void => {
  navMobile();
  popupContact();
  initCloudLoop();
  initMarker();
  initLoopWordSwiper();
  resetVideos();
  barbaLogoRotate();
  animFooter();
  loadModelViewerScript();
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
        gsap.from('section h1', {
          scale: 2,
          duration: 0.5,
          ease: 'power2.out',
        });
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
        initCloudLoop();

        requestAnimationFrame(() => {
          initWhereProjectsScroll();
          initHeartBeat();
          initIntroParallax();
        });

        // requestAnimationFrame(() => {
        //   initWhyLetterScroll();
        // });
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
        initShowWorkName();
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
        initShowWorkName();
      },
      afterEnter() {
        requestAnimationFrame(() => {
          initWorksParallax();
        });
        initProjectsNav();
      },
      afterLeave() {
        /*
        ! FIX Issue - First Load on projects -> Back = no navbar
         Works if not first load
        */
        gsap.to('.nav_component', {
          yPercent: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
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
  // Fermer la navigation mobile si elle est ouverte
  closeNavMobile();

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

  // Ensure navbar is visible when entering any page except projects
  // This fixes the issue when first loading on projects then navigating away
  if (data.next.namespace !== 'projects') {
    const navComponent = document.querySelector('.nav_component');
    if (navComponent) {
      gsap.set(navComponent, { clearProps: 'yPercent' });
    }
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
