import './index.css';

import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

import { initHowSlider } from '$utils/animations/home/howSlider';
import { initCloudLoop } from '$utils/animations/home/introCloudLoop';
import { initAnimGLB } from '$utils/animations/home/introGlb';
import { resetGlbPosition } from '$utils/animations/home/introGlb';
import { initIntroParallax } from '$utils/animations/home/introParallax';
import { initStudiosHover } from '$utils/animations/home/studiosHover';
import { initHeartBeat } from '$utils/animations/home/whereHeartBeat';
import { initWhereProjectsScroll } from '$utils/animations/home/whereProjectsScroll';
import { initRainbowCursor } from '$utils/animations/home/whereRainbow';
import { initWhoSlider } from '$utils/animations/home/whoSlider';
import { whyAssetAnimations } from '$utils/animations/home/whyAnimations';
import { initNetworkGradiant } from '$utils/animations/network/networkGradient';
import { initCardsBorder } from '$utils/animations/pricing/cardsBorder';
import { initOtherProjectsSlider } from '$utils/animations/projects/OtherProjectsSlider';
import { initWorksParallax } from '$utils/animations/projects/parallaxWorks';
import { initProjectsNav } from '$utils/animations/projects/projectsNav';
import { initShowWorkName } from '$utils/animations/works/showWorkName';
// import { initWhyLetterScroll } from '$utils/animations/whyLetterScroll';
import { worksMouse } from '$utils/animations/works/worksMouse';
import { barbaLogoRotate, setupLogoHover } from '$utils/barba/barbaLogoRotate';
import { resetVideos } from '$utils/barba/barbaResetVideo';
import { enterAnimation, leaveAnimation } from '$utils/barba/barbaTransition';
import {
  destroyAllCarousels,
  initLoopStudiosSwiper,
  initLoopWordSwiper,
} from '$utils/global/carousel';
import { animFooter } from '$utils/global/footerAnimation';
import { loadModelViewerScript } from '$utils/global/loadModalViewer';
import { loadScript } from '$utils/global/loadScript';
import { initMarker } from '$utils/global/marker';
import { closeNavMobile, navMobile } from '$utils/global/navbarMobile';
import { popupContact } from '$utils/global/popupContact';
import { initPreloader } from '$utils/global/preloader';
import { initStaggerTop } from '$utils/global/staggerTop';

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

// Initialiser le preloader avant tout le reste (uniquement première visite)
initPreloader();
initGlobalFunctions();
setupLogoHover();

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: 'opacity-transition',
      leave(data: { current: { container: HTMLElement } }) {
        return leaveAnimation(data);
      },
      enter(data: { next: { container: HTMLElement } }) {
        return enterAnimation(data);
      },
    },
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        initRainbowCursor();
        initLoopStudiosSwiper();
        initStudiosHover();
        whyAssetAnimations();
        initWhoSlider();
        initHowSlider();
        initCloudLoop();
        initAnimGLB();
        resetGlbPosition();

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
        initStaggerTop();
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
      beforeEnter() {
        initStaggerTop();
      },
    },
    {
      namespace: 'network',
      beforeEnter() {
        initNetworkGradiant();
        initStaggerTop();
      },
    },
    {
      namespace: 'pricings',
      beforeEnter() {
        initCardsBorder();
      },
    },
    {
      namespace: 'projects',
      beforeEnter() {
        restartWebflow();
        initShowWorkName();
        initProjectsNav();
        // Initialiser les animations AVANT que la page soit visible pour éviter les glitches
        // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
        requestAnimationFrame(() => {
          initWorksParallax();
        });
      },
      afterEnter() {
        // Force ScrollTrigger à recalculer avec les vraies dimensions après le rendu complet
        // Double requestAnimationFrame pour s'assurer que les dimensions sont calculées
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            initOtherProjectsSlider();
            ScrollTrigger.refresh();
          });
        });
      },
      beforeLeave() {
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

  // Détruire tous les carousels avec un délai pour correspondre à l'animation de sortie
  // L'animation opacity dure 500ms, on destroy à 300ms quand c'est bien caché
  destroyAllCarousels(350);

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
  // Ensure scroll is at top (backup in case transition scroll didn't work)
  // Use multiple requestAnimationFrame to ensure it happens after all DOM updates
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }
      if (document.scrollingElement) {
        (document.scrollingElement as HTMLElement).scrollTop = 0;
        (document.scrollingElement as HTMLElement).scrollLeft = 0;
      }
    });
  });
  initGlobalFunctions();
  restartWebflow();
  // Refresh ScrollTrigger to recalculate positions after DOM changes
  ScrollTrigger.refresh();
});
