/* Gestion du menu side nav V2 avec animations - Fonctionne sur toutes les tailles d'écran */

// Variable pour éviter d'initialiser plusieurs fois
let isNavbarV2Initialized = false;

// Variables pour stocker les références aux éléments
let navButton: HTMLElement | null = null;
let navMenu: HTMLElement | null = null;
let logoComponent: HTMLElement | null = null;
let isMenuOpen = false;
let isLogoScrolled = false;

// Fonction pour gérer le scroll du logo
function handleLogoScroll() {
  if (!logoComponent) return;

  const scrollThreshold = window.innerHeight * 0.5; // 50vh
  const currentScroll = window.scrollY;

  if (currentScroll > scrollThreshold && !isLogoScrolled) {
    // Scroll > 50vh : scale(1) + blend-mode: difference
    isLogoScrolled = true;
    logoComponent.style.transform = 'scale(1)';
  } else if (currentScroll <= scrollThreshold && isLogoScrolled) {
    // En haut de page : scale(3) + blend-mode: normal
    isLogoScrolled = false;
    logoComponent.style.transform = 'scale(5)';
  }
}

// Fonction pour fermer le side nav (appelable depuis l'extérieur)
export function closeNavbarV2() {
  if (!navButton || !navMenu) {
    return;
  }

  if (!isMenuOpen) return;

  isMenuOpen = false;

  // Ajouter la transition de fermeture
  navMenu.style.transition = 'transform 0.3s ease-out';

  // Déclencher l'animation de fermeture
  navMenu.style.transform = 'translateY(100%)';

  // Remettre le logo à sa taille selon la position de scroll
  if (logoComponent) {
    logoComponent.style.transition = 'transform 0.3s ease-out';
    const scrollThreshold = window.innerHeight * 0.5;
    if (window.scrollY > scrollThreshold) {
      logoComponent.style.transform = 'scale(1)';
      logoComponent.style.mixBlendMode = 'difference';
      isLogoScrolled = true;
    } else {
      logoComponent.style.transform = 'scale(5)';
      logoComponent.style.mixBlendMode = 'normal';
      isLogoScrolled = false;
    }
  }

  // Retirer la classe is-active du bouton
  navButton.classList.remove('is-active');

  // Réactiver le scroll de la page après l'animation
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 300);
}

// Fonction pour ouvrir le side nav (appelable depuis l'extérieur)
export function openNavbarV2() {
  if (!navButton || !navMenu) return;

  if (isMenuOpen) return;

  isMenuOpen = true;

  // Empêcher le scroll de la page
  document.body.style.overflow = 'hidden';

  // Ajouter la classe is-active au bouton
  navButton.classList.add('is-active');

  // Ajouter la transition
  navMenu.style.transition = 'transform 0.3s ease-out';

  // Animer le logo
  if (logoComponent) {
    logoComponent.style.transition = 'transform 0.3s ease-out';
    logoComponent.style.transform = 'scale(4)';
  }

  // Déclencher l'animation d'ouverture
  requestAnimationFrame(() => {
    if (navMenu) {
      navMenu.style.transform = 'translateY(0%)';
    }
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

  // Initialiser la position du menu (caché en haut)
  navMenu.style.transform = 'translateY(100%)';
  navMenu.style.transition = 'none'; // Pas de transition pour l'état initial

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

  // Initialiser le logo avec scroll
  if (logoComponent) {
    // Appliquer la transition pour les animations fluides
    logoComponent.style.transition = 'transform 0.5s ease-out';

    // État initial : en haut de page = scale(3) + normal
    logoComponent.style.transform = 'scale(5)';

    // Vérifier l'état initial au cas où la page est déjà scrollée
    handleLogoScroll();

    // Écouter le scroll
    window.addEventListener('scroll', handleLogoScroll, { passive: true });
  }
}
