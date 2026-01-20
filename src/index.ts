import './index.css';

import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

import { initClientsAnimation } from '$utils/animations/home/clientsAnimation';
import { initHowSlider } from '$utils/animations/home/howSlider';
import { initCloudLoop } from '$utils/animations/home/introCloudLoop';
import { initAnimGLB, resetGlbPosition } from '$utils/animations/home/introGlb';
// import { initIntroParallax } from '$utils/animations/home/introParallax';
// import { initServicesParallax } from '$utils/animations/home/servicesParallax';
import { initSentenceScroll } from '$utils/animations/home/sentenceScroll';
import { initServicesParallaxV2 } from '$utils/animations/home/servicesParallaxV2';
import { initStudiosHover } from '$utils/animations/home/studiosHover';
import { initHeartBeat } from '$utils/animations/home/whereHeartBeat';
import { initWhereProjectsScroll } from '$utils/animations/home/whereProjectsScroll';
import { initRainbowCursor } from '$utils/animations/home/whereRainbow';
import { initWhoSlider } from '$utils/animations/home/whoSlider';
import { whyAssetAnimations } from '$utils/animations/home/whyAnimations';
import { initBaselineDates } from '$utils/animations/home-v2/baselineDates';
import { initHomeProjectsSlider } from '$utils/animations/home-v2/projectsSlider';
import { initStrategicDecoRotate } from '$utils/animations/home-v2/strategicDecoRotate';
import { initVideoSynchro } from '$utils/animations/home-v2/videoSynchro';
import { initNetworkGradiant } from '$utils/animations/network/networkGradient';
import { initCardsBorder } from '$utils/animations/pricing/cardsBorder';
import { initOtherProjectsSlider } from '$utils/animations/projects/OtherProjectsSlider';
import { initWorksParallax } from '$utils/animations/projects/parallaxWorks';
import { initProjectsNav } from '$utils/animations/projects/projectsNav';
// import { initWhyLetterScroll } from '$utils/animations/whyLetterScroll';
import { initShowWorkName } from '$utils/animations/works/showWorkName';
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
import { initFooterLinksScroll } from '$utils/global/footerLinksScroll';
import { initFooterScrollAnimation } from '$utils/global/footerScrollAnimation';
import { controlFooterVisibility } from '$utils/global/footerVisibilityControl';
import { destroyGlassEffect, initGlassEffect } from '$utils/global/glassEffect';
import { loadModelViewerScript } from '$utils/global/loadModalViewer';
import { loadScript } from '$utils/global/loadScript';
import { initMarker } from '$utils/global/marker';
import { closeNavMobile, navMobile } from '$utils/global/navbarMobile';
import { initNavbarSlider } from '$utils/global/navbarSlider';
import { closeNavbarV2, navbarV2, reinitLogoScrollTrigger } from '$utils/global/navbarV2';
import { popupContact } from '$utils/global/popupContact';
import { initPreloader } from '$utils/global/preloader';
import { initStaggerTop } from '$utils/global/staggerTop';

// Variable pour stocker la fonction de nettoyage de worksMouse
let cleanupWorksMouse: (() => void) | null = null;

// Variables pour stocker les fonctions de nettoyage des animations du footer
let cleanupFooterScrollAnimation: (() => void) | null = null;
let cleanupFooterLinksScroll: (() => void) | null = null;
let cleanupAnimFooter: (() => void) | null = null;
let cleanupStudiosHover: (() => void) | null = null;

// Group all page enhancements to call on first load and after Barba navigations
const initGlobalFunctions = (namespace?: string): void => {
  // Navbar
  navMobile();
  navbarV2();
  initNavbarSlider();

  // Animation
  resetVideos();
  popupContact();
  initCloudLoop();
  initLoopWordSwiper();

  initGlassEffect();

  // Script
  initMarker();
  loadModelViewerScript();
  loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-accordion@1/accordion.js');

  // Footer - Nettoyer les animations précédentes avant de réinitialiser
  if (cleanupFooterScrollAnimation) {
    cleanupFooterScrollAnimation();
    cleanupFooterScrollAnimation = null;
  }
  if (cleanupFooterLinksScroll) {
    cleanupFooterLinksScroll();
    cleanupFooterLinksScroll = null;
  }
  if (cleanupAnimFooter) {
    cleanupAnimFooter();
    cleanupAnimFooter = null;
  }
  if (cleanupStudiosHover) {
    cleanupStudiosHover();
    cleanupStudiosHover = null;
  }

  // Réinitialiser les animations du footer
  barbaLogoRotate();
  cleanupAnimFooter = animFooter();
  // Initialiser l'animation de scroll du footer UNIQUEMENT sur la page d'accueil
  // initFooterScrollAnimation vérifie elle-même si l'élément est visible
  const isHomePage = namespace === 'home-v2';
  if (isHomePage) {
    // Vérifier que l'élément est visible avant d'initialiser
    const footerScroll = document.querySelector('.footer-2_scroll') as HTMLElement | null;
    if (footerScroll) {
      // S'assurer que l'élément est visible
      const computedStyle = window.getComputedStyle(footerScroll);
      if (computedStyle.display !== 'none') {
        // Initialiser l'animation de scroll du footer dans un requestAnimationFrame
        // pour laisser le temps au navigateur de recalculer les positions après le changement de display
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cleanupFooterScrollAnimation = initFooterScrollAnimation();
          });
        });
      } else {
        console.error(
          '[initGlobalFunctions] .footer-2_scroll is hidden, skipping animation initialization'
        );
      }
    }
  }

  cleanupFooterLinksScroll = initFooterLinksScroll();
  initLoopStudiosSwiper();
  cleanupStudiosHover = initStudiosHover();
};

// Initialiser le preloader avant tout le reste (uniquement première visite)
initPreloader();
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
    // {
    //   namespace: 'home',
    //   beforeEnter() {
    //     initRainbowCursor();
    //     initLoopStudiosSwiper();
    //     initStudiosHover();
    //     whyAssetAnimations();
    //     initWhoSlider();
    //     initHowSlider();
    //     initCloudLoop();
    //     initAnimGLB();
    //     resetGlbPosition();

    //     requestAnimationFrame(() => {
    //       initWhereProjectsScroll();
    //       initHeartBeat();
    //       initIntroParallax();
    //       initServicesParallax();
    //     });

    //     // requestAnimationFrame(() => {
    //     //   initWhyLetterScroll();
    //     // });
    //   },
    // },
    {
      namespace: 'home-v2',
      beforeEnter() {
        initBaselineDates();
        initRainbowCursor();
        whyAssetAnimations();
        // initWhoSlider();
        // initHowSlider();
        // initCloudLoop();
        initAnimGLB();
        resetGlbPosition();
        initSentenceScroll();
        initHomeProjectsSlider();
        initClientsAnimation();

        requestAnimationFrame(() => {
          initWhereProjectsScroll();
          initHeartBeat();
          initStrategicDecoRotate();
          // initIntroParallax();
          // initServicesParallaxV2();
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
        initWhoSlider();
        initHowSlider();
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
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          initServicesParallaxV2();
        });
      },
    },
    {
      namespace: 'projects',
      beforeEnter() {
        restartWebflow();
        initShowWorkName();
        initProjectsNav();
      },
      afterEnter() {
        // Force ScrollTrigger à recalculer avec les vraies dimensions après le rendu complet
        // Double requestAnimationFrame pour s'assurer que les dimensions sont calculées
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            initOtherProjectsSlider();
            initWorksParallax();
          });
        });
      },
      beforeLeave() {},
    },
  ],
});

/* 
! Barba Hooks
*/

/* 
! Barba Hooks - Global
*/

// Hook pour le chargement initial
barba.hooks.once(() => {
  // Détecter le namespace de la page actuelle au chargement initial
  const currentNamespace = barba.history?.current?.namespace || '';
  // Contrôler la visibilité du footer avant d'initialiser les animations
  controlFooterVisibility(currentNamespace);
  // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Initialiser les fonctions globales au chargement initial avec le namespace
      initGlobalFunctions(currentNamespace);
    });
  });
});

barba.hooks.beforeLeave(() => {
  // Fermer la navigation mobile si elle est ouverte
  restartWebflow();
  closeNavMobile();
  closeNavbarV2();

  // Nettoyer les animations du footer (hors container) avant de tuer les ScrollTriggers
  if (cleanupFooterScrollAnimation) {
    cleanupFooterScrollAnimation();
    cleanupFooterScrollAnimation = null;
  }
  if (cleanupFooterLinksScroll) {
    cleanupFooterLinksScroll();
    cleanupFooterLinksScroll = null;
  }
  if (cleanupAnimFooter) {
    cleanupAnimFooter();
    cleanupAnimFooter = null;
  }
  if (cleanupStudiosHover) {
    cleanupStudiosHover();
    cleanupStudiosHover = null;
  }

  // Détruire tous les carousels avec un délai pour correspondre à l'animation de sortie
  // L'animation opacity dure 500ms, on destroy à 300ms quand c'est bien caché
  destroyAllCarousels(350);

  // Nettoyer les effets glass
  destroyGlassEffect();

  // Kill all ScrollTriggers and reset inline styles
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill(true); // true = revert inline styles
  });
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
  ScrollTrigger.refresh();
});

// Ensure Webflow and custom animations are fully re-initialized
barba.hooks.afterEnter((data: { next: { namespace: string } }) => {
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

  // Contrôler la visibilité du footer AVANT d'initialiser les animations
  // Utiliser plusieurs requestAnimationFrame pour s'assurer que le DOM est complètement prêt
  // et que le navigateur a eu le temps de recalculer les dimensions
  controlFooterVisibility(data.next.namespace);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Initialiser les fonctions globales après avoir contrôlé la visibilité
      // et après que le navigateur ait eu le temps de recalculer
      initGlobalFunctions(data.next.namespace);
    });
  });

  restartWebflow();
  initVideoSynchro();
  // Refresh ScrollTrigger to recalculate positions after DOM changes

  // Réinitialiser le ScrollTrigger du logo après la transition Barba
  // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
  requestAnimationFrame(() => {
    reinitLogoScrollTrigger();
  });
});
