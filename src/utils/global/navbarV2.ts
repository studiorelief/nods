/* Gestion du menu side nav V2 avec animations - Fonctionne sur toutes les tailles d'écran */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initNavbarSlider } from './navbarSlider';

// Variable pour éviter d'initialiser plusieurs fois
let isNavbarV2Initialized = false;

// Variables pour stocker les références aux éléments
let navButton: HTMLElement | null = null;
let navMenu: HTMLElement | null = null;
let logoComponent: HTMLElement | null = null;
let isMenuOpen = false;
let navBackground: HTMLElement | null = null;
let navProjectWrapper: HTMLElement | null = null;
let navLinks: HTMLElement[] = [];
let logoScrollTrigger: ScrollTrigger | null = null;
let logoAnimation: gsap.core.Tween | null = null;

// Fonction pour fermer le side nav (appelable depuis l'extérieur)
export function closeNavbarV2() {
  if (!navButton || !navMenu) {
    return;
  }

  if (!isMenuOpen) return;

  isMenuOpen = false;

  // S'assurer que les références sont à jour
  if (!navBackground) {
    navBackground = document.querySelector('.nav-2_menu-side-background') as HTMLElement | null;
  }
  if (!navProjectWrapper) {
    navProjectWrapper = document.querySelector(
      '.nav-2_menu-side_project-wrapper'
    ) as HTMLElement | null;
  }
  if (!navLinks.length && navMenu) {
    navLinks = gsap.utils.toArray<HTMLElement>(navMenu.querySelectorAll('.nav-2_menu_link'));
  }

  // Stopper les animations en cours sans réinitialiser les styles
  if (navLinks.length > 0) {
    gsap.killTweensOf(navLinks);
  }
  if (navBackground) {
    gsap.killTweensOf(navBackground);
  }
  if (navProjectWrapper) {
    gsap.killTweensOf(navProjectWrapper);
  }

  // Timeline de fermeture : stagger inverse sur les liens + fade-out du background et du project wrapper
  const tl = gsap.timeline({
    onComplete: () => {
      // Réinitialiser les styles des liens, du background et du project wrapper après l'anim
      if (navLinks.length > 0) {
        gsap.set(navLinks, { clearProps: 'all' });
      }
      if (navBackground) {
        gsap.set(navBackground, { clearProps: 'all' });
      }
      if (navProjectWrapper) {
        gsap.set(navProjectWrapper, { clearProps: 'all' });
      }

      // Remettre le logo à sa taille selon la position de scroll
      if (logoComponent && logoScrollTrigger) {
        // Réactiver le ScrollTrigger et forcer la mise à jour
        logoScrollTrigger.enable();
        // Forcer le recalcul pour appliquer les bonnes valeurs selon le scroll actuel
        logoScrollTrigger.refresh();
        // Mettre à jour immédiatement les valeurs selon la position de scroll
        logoScrollTrigger.update();
      }

      // Retirer la classe is-active du bouton
      navButton!.classList.remove('is-active');

      // Masquer la nav avec display: none
      navMenu!.style.display = 'none';

      // Réactiver le scroll de la page
      document.body.style.overflow = '';
    },
  });

  if (navLinks.length > 0) {
    tl.to(navLinks, {
      opacity: 0,
      x: '100%',
      duration: 0.6,
      ease: 'power2.in',
      stagger: {
        each: 0.1,
        from: 'end', // stagger inverse
      },
    });
  }

  if (navBackground) {
    // Fade-out du background, en parallèle avec les liens
    tl.to(
      navBackground,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
      },
      0
    );
  }

  if (navProjectWrapper) {
    // Fade-out du project wrapper, en parallèle avec les liens
    tl.to(
      navProjectWrapper,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
      },
      0
    );
  }
}

// Fonction pour ouvrir le side nav (appelable depuis l'extérieur)
export function openNavbarV2() {
  if (!navButton || !navMenu) return;

  if (isMenuOpen) return;

  isMenuOpen = true;

  // Afficher la nav avec display: flex
  navMenu.style.display = 'flex';

  // Mettre à jour les références du background, du project wrapper et des liens à chaque ouverture
  navBackground = document.querySelector('.nav-2_menu-side-background') as HTMLElement | null;
  navProjectWrapper = document.querySelector(
    '.nav-2_menu-side_project-wrapper'
  ) as HTMLElement | null;
  navLinks = gsap.utils.toArray<HTMLElement>(navMenu.querySelectorAll('.nav-2_menu_link'));

  // Empêcher le scroll de la page
  document.body.style.overflow = 'hidden';

  // Ajouter la classe is-active au bouton
  navButton.classList.add('is-active');

  // Timeline d'ouverture pour synchroniser tous les fade-in
  const tl = gsap.timeline();

  // État de départ pour le background
  if (navBackground) {
    gsap.set(navBackground, { opacity: 0 });
    tl.to(
      navBackground,
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      0
    );
  }

  // État de départ pour le project wrapper
  if (navProjectWrapper) {
    gsap.set(navProjectWrapper, { opacity: 0 });
    tl.to(
      navProjectWrapper,
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      0
    );
  }

  // Animer les liens de la nav avec le même stagger que le footer (x + opacité)
  if (navLinks.length > 0) {
    // État de départ (similaire à initFooterLinksScroll)
    gsap.set(navLinks, {
      opacity: 0,
      x: '100%',
    });

    tl.to(
      navLinks,
      {
        opacity: 1,
        x: '0%',
        duration: 0.6,
        ease: 'power2.out',
        stagger: {
          each: 0.1,
          from: 'start',
        },
      },
      0
    );
  }

  // Animer le logo
  if (logoComponent) {
    // Désactiver temporairement le ScrollTrigger pour forcer le scale
    if (logoScrollTrigger) {
      logoScrollTrigger.disable();
    }
    gsap.to(logoComponent, {
      scale: 5,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  // Initialiser le slider de la navbar après l'ouverture
  // Utiliser requestAnimationFrame pour s'assurer que le DOM est visible
  requestAnimationFrame(() => {
    initNavbarSlider();
  });
}

export function navbarV2() {
  // Éviter d'initialiser plusieurs fois
  if (isNavbarV2Initialized) {
    return;
  }

  // Sélectionner les éléments nécessaires
  navButton = document.querySelector('.nav-2_button-side') as HTMLElement;
  navMenu = document.querySelector('.nav-2_menu-side') as HTMLElement;
  logoComponent = document.querySelector('.nav-2_logo') as HTMLElement;
  const navCloseWrapper = document.querySelector('.nav-2_close-wrapper') as HTMLElement;

  if (!navButton || !navMenu) {
    // Debug: décommenter pour voir si les éléments sont trouvés
    // console.warn('NavbarV2: Éléments non trouvés', {
    //   navButton: !!navButton,
    //   navMenu: !!navMenu,
    // });
    return;
  }

  // Marquer comme initialisé
  isNavbarV2Initialized = true;

  // Initialiser le menu comme fermé (display: none)
  navMenu.style.display = 'none';

  // Handler du clic sur le bouton
  function handleButtonClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    if (isMenuOpen) {
      closeNavbarV2();
    } else {
      openNavbarV2();
    }
  }

  // Handler du clic sur le wrapper de fermeture
  function handleCloseClick(e: Event) {
    e.preventDefault();
    closeNavbarV2();
  }

  // Fermer le menu avec la touche Escape
  function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeNavbarV2();
    }
  }

  // Ajouter les événements
  navButton.addEventListener('click', handleButtonClick);

  if (navCloseWrapper) {
    navCloseWrapper.addEventListener('click', handleCloseClick);
  }

  // Écouter la touche Escape
  document.addEventListener('keydown', handleEscape);

  // Initialiser le logo avec ScrollTrigger
  initLogoScrollTrigger();
}

// Fonction pour initialiser/réinitialiser le ScrollTrigger du logo
function initLogoScrollTrigger() {
  // Nettoyer le ScrollTrigger existant s'il existe
  if (logoScrollTrigger) {
    logoScrollTrigger.kill(true);
    logoScrollTrigger = null;
  }
  if (logoAnimation) {
    logoAnimation.kill();
    logoAnimation = null;
  }

  // Récupérer le logo (au cas où il n'est pas encore défini)
  if (!logoComponent) {
    logoComponent = document.querySelector('.nav-2_logo') as HTMLElement;
  }

  if (!logoComponent) {
    return;
  }

  // État initial : en haut de page = scale(5) + normal
  gsap.set(logoComponent, {
    scale: 5,
    mixBlendMode: 'normal',
  });

  // Créer l'animation ScrollTrigger pour le scale et mixBlendMode
  // L'animation se déclenche de 0 à 50vh de scroll
  logoAnimation = gsap.to(logoComponent, {
    scale: 1,
    // duration: 0.3,
    mixBlendMode: 'difference',
    ease: 'power2.out',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: () => `+=${window.innerHeight * 0.5}`,
      scrub: true,
      markers: false,
    },
  });

  // Stocker la référence au ScrollTrigger pour pouvoir le rafraîchir
  logoScrollTrigger = logoAnimation.scrollTrigger || null;
}

// Fonction pour réinitialiser le ScrollTrigger du logo (appelable depuis l'extérieur)
export function reinitLogoScrollTrigger() {
  initLogoScrollTrigger();
}
