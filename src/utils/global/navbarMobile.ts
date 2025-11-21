/* Gestion du menu mobile side nav avec animations */

// Variable pour éviter d'initialiser plusieurs fois
let isNavMobileInitialized = false;

// Variables pour stocker les références aux éléments
let navButton: HTMLElement | null = null;
let navMenu: HTMLElement | null = null;

// Fonction pour fermer le side nav (appelable depuis l'extérieur)
export function closeNavMobile() {
  if (!navButton || !navMenu) {
    return;
  }

  // Ajouter la transition de fermeture
  navMenu.style.transition = 'transform 0.3s ease-out';

  // Déclencher l'animation de fermeture
  navMenu.style.transform = 'translateY(-100%)';

  // Retirer la classe is-active du bouton
  navButton.classList.remove('is-active');

  // Réactiver le scroll de la page après l'animation
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 300);
}

export function navMobile() {
  // Éviter d'initialiser plusieurs fois
  if (isNavMobileInitialized) {
    return;
  }

  // Sélectionner les éléments nécessaires
  navButton = document.querySelector('.nav_button-side') as HTMLElement;
  navMenu = document.querySelector('.nav_menu-side') as HTMLElement;
  const navCloseWrapper = document.querySelector('.nav_close-wrapper') as HTMLElement;

  if (!navButton || !navMenu) {
    // console.warn('Éléments nav mobile non trouvés');
    return;
  }

  // Marquer comme initialisé
  isNavMobileInitialized = true;

  // Media query pour détecter les écrans < 991px
  const mobileMediaQuery = window.matchMedia('(max-width: 991px)');

  // Fonction pour ouvrir le side nav
  function openSideNav() {
    if (!navButton || !navMenu) return;

    // Empêcher le scroll de la page
    document.body.style.overflow = 'hidden';

    // Ajouter la classe is-active immédiatement
    navButton.classList.add('is-active');
    // console.log('openSideNav: is-active ajoutée', navButton.classList.contains('is-active'));

    // Ajouter la transition
    navMenu.style.transition = 'transform 0.3s ease-out';

    // Déclencher l'animation
    requestAnimationFrame(() => {
      if (navMenu) {
        navMenu.style.transform = 'translateY(0%)';
      }
    });
  }

  // Fonction pour réinitialiser l'état sur desktop
  function resetOnDesktop() {
    if (!navMenu || !navButton) return;
    // Fermer le menu et réinitialiser les styles
    navMenu.style.transform = '';
    navMenu.style.transition = '';
    navButton.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // Handler du clic sur le bouton
  function handleButtonClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    // Ne fonctionner que sur mobile
    if (!mobileMediaQuery.matches) return;

    // Si le bouton a déjà is-active, on ferme, sinon on ouvre
    const isActive = navButton?.classList.contains('is-active');
    // console.log('Nav button clicked, is-active avant:', isActive);

    if (isActive) {
      closeNavMobile();
    } else {
      openSideNav();
    }
  }

  // Handler du clic sur le wrapper de fermeture
  function handleCloseClick(e: Event) {
    // Ne fonctionner que sur mobile
    if (!mobileMediaQuery.matches) return;

    e.preventDefault();
    closeNavMobile();
  }

  // Ajouter les événements de clic
  navButton.addEventListener('click', handleButtonClick);

  if (navCloseWrapper) {
    navCloseWrapper.addEventListener('click', handleCloseClick);
  }

  // Écouter les changements de taille d'écran
  mobileMediaQuery.addEventListener('change', (e) => {
    if (!e.matches) {
      // Si on passe en desktop, réinitialiser
      resetOnDesktop();
    }
  });
}
