/**
 * Fonction pour transformer .works-mouse_component en souris
 * et gérer l'affichage du texte au survol des éléments .works_collection-item
 * Active uniquement sur les écrans > 991px
 */
export function worksMouse(): () => void {
  const mouseComponent = document.querySelector('.works-mouse_component') as HTMLElement;
  const collectionItems = document.querySelectorAll('.works_collection-item');
  const navComponent = document.querySelector('.nav_component') as HTMLElement | null;

  if (!mouseComponent) {
    // console.warn('Element .works-mouse_component not found');
    return () => {};
  }

  const BREAKPOINT = 992;
  let isActive = false;
  let cleanup: (() => void) | null = null;

  // Fonction pour initialiser la souris personnalisée
  const initMouse = () => {
    if (isActive) return;
    isActive = true;

    // S'assurer que le composant n'est pas dans un conteneur transformé (Barba anime les containers)
    // position: fixed est relatif au viewport uniquement si l'élément est enfant direct de <body>
    let didAppendToBody = false;
    if (mouseComponent.parentElement !== document.body) {
      document.body.appendChild(mouseComponent);
      didAppendToBody = true;
    }

    // Variables pour suivre la position de la souris
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isInitialized = false;

    // Fonction pour mettre à jour la position de la souris
    const updateMousePosition = (e: MouseEvent) => {
      // Première initialisation avec la vraie position de la souris
      if (!isInitialized) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        targetX = mouseX;
        targetY = mouseY;
        isInitialized = true;
      }

      // Vérifier si la souris est dans .section_footer
      const footerSection = document.querySelector('.section_footer');
      if (footerSection) {
        const footerRect = footerSection.getBoundingClientRect();
        const isInFooter =
          e.clientX >= footerRect.left &&
          e.clientX <= footerRect.right &&
          e.clientY >= footerRect.top &&
          e.clientY <= footerRect.bottom;

        if (isInFooter) {
          // Cacher le composant curseur dans le footer
          mouseComponent.style.opacity = '0';
          return;
        }
      }

      // Afficher le composant curseur
      mouseComponent.style.opacity = '1';
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Fonction d'animation pour suivre la souris de manière fluide
    let animationId: number | null = null;
    const animateMouse = () => {
      // Interpolation pour un mouvement fluide
      targetX += (mouseX - targetX) * 0.15;
      targetY += (mouseY - targetY) * 0.15;

      // Centrer l'élément par rapport au curseur
      const rect = mouseComponent.getBoundingClientRect();
      const centerX = targetX - rect.width / 2;
      const centerY = targetY - rect.height / 2;

      // Appliquer la position centrée
      mouseComponent.style.left = `${centerX}px`;
      mouseComponent.style.top = `${centerY}px`;

      animationId = requestAnimationFrame(animateMouse);
    };

    // Fonction pour gérer l'entrée du survol
    const handleMouseEnter = () => {
      const mouseTextWrapper = mouseComponent.querySelector(
        '.works-mouse_text-wrapper'
      ) as HTMLElement;
      const mouseIcon = mouseComponent.querySelector('.works-mouse_icon') as HTMLElement;

      if (mouseTextWrapper) {
        mouseTextWrapper.style.width = '100%';
      }

      if (mouseIcon) {
        mouseIcon.style.transform = 'rotate(360deg)';
      }

      // Changer la largeur du composant
      mouseComponent.style.width = '8rem';
    };

    // Fonction pour gérer la sortie du survol
    const handleMouseLeave = () => {
      const mouseTextWrapper = mouseComponent.querySelector(
        '.works-mouse_text-wrapper'
      ) as HTMLElement;
      const mouseIcon = mouseComponent.querySelector('.works-mouse_icon') as HTMLElement;

      if (mouseTextWrapper) {
        mouseTextWrapper.style.width = '0';
      }

      if (mouseIcon) {
        mouseIcon.style.transform = 'rotate(0deg)';
      }

      // Restaurer la largeur par défaut du composant
      mouseComponent.style.width = '2.5rem';
    };

    // Initialiser la position de la souris
    mouseComponent.style.position = 'fixed';
    mouseComponent.style.pointerEvents = 'none';
    mouseComponent.style.zIndex = '10';
    mouseComponent.style.transition = 'width 0.3s ease-out, opacity 0.15s ease-out';
    mouseComponent.style.left = '0px';
    mouseComponent.style.top = '0px';
    mouseComponent.style.opacity = '1';

    // Cacher le curseur par défaut
    document.body.style.cursor = 'none';

    // Initialiser le wrapper du texte avec transition
    const mouseTextWrapper = mouseComponent.querySelector(
      '.works-mouse_text-wrapper'
    ) as HTMLElement;
    if (mouseTextWrapper) {
      mouseTextWrapper.style.width = '0';
      mouseTextWrapper.style.transition = 'width 0.3s ease-out';
      mouseTextWrapper.style.overflow = 'hidden';
    }

    // Initialiser l'icône avec transition de rotation
    const mouseIcon = mouseComponent.querySelector('.works-mouse_icon') as HTMLElement;
    if (mouseIcon) {
      mouseIcon.style.transition = 'transform 0.3s ease-out';
    }

    // Définir la largeur par défaut du composant
    mouseComponent.style.width = '2.5rem';

    // Capturer la position de la souris dès le retour sur la page
    const captureInitialPosition = () => {
      // Créer un listener temporaire pour capturer la vraie position
      const tempHandler = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        targetX = mouseX;
        targetY = mouseY;
        isInitialized = true;
        document.removeEventListener('mousemove', tempHandler);
      };

      document.addEventListener('mousemove', tempHandler);

      // Fallback après 100ms si pas de mouvement
      setTimeout(() => {
        if (!isInitialized) {
          mouseX = window.innerWidth / 2;
          mouseY = window.innerHeight / 2;
          targetX = mouseX;
          targetY = mouseY;
          isInitialized = true;
          document.removeEventListener('mousemove', tempHandler);
        }
      }, 100);
    };

    // Capturer la position initiale
    captureInitialPosition();

    // Écouter le mouvement de la souris
    document.addEventListener('mousemove', updateMousePosition);

    // Écouter le scroll pour maintenir la synchronisation
    const handleScroll = () => {
      // Re-appliquer la dernière position cible pour rester aligné au viewport
      const width = mouseComponent.offsetWidth;
      const height = mouseComponent.offsetHeight;
      const centerX = targetX - width / 2;
      const centerY = targetY - height / 2;
      mouseComponent.style.left = `${centerX}px`;
      mouseComponent.style.top = `${centerY}px`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Ajouter les événements de survol à tous les éléments .works_collection-item
    collectionItems.forEach((item) => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });

    // Afficher la souris native et masquer le custom sur la navigation
    const handleNavEnter = () => {
      mouseComponent.style.opacity = '0';
      document.body.style.cursor = 'auto';
    };
    const handleNavLeave = () => {
      mouseComponent.style.opacity = '1';
      document.body.style.cursor = 'none';
    };
    if (navComponent) {
      navComponent.addEventListener('mouseenter', handleNavEnter);
      navComponent.addEventListener('mouseleave', handleNavLeave);
    }

    // Démarrer l'animation
    animateMouse();

    // Stocker la fonction de nettoyage
    cleanup = () => {
      document.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('scroll', handleScroll);
      collectionItems.forEach((item) => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (navComponent) {
        navComponent.removeEventListener('mouseenter', handleNavEnter);
        navComponent.removeEventListener('mouseleave', handleNavLeave);
      }
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      // Restaurer le curseur par défaut sur body
      document.body.style.cursor = 'auto';
      // Cacher et supprimer le composant si on l'a déplacé dans le body
      mouseComponent.style.opacity = '0';
      if (didAppendToBody && document.body.contains(mouseComponent)) {
        mouseComponent.remove();
      }
      isActive = false;
    };
  };

  // Fonction pour désactiver la souris personnalisée
  const deactivateMouse = () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  };

  // Fonction pour vérifier la taille de l'écran et activer/désactiver
  const checkScreenSize = () => {
    const shouldBeActive = window.innerWidth >= BREAKPOINT;

    if (shouldBeActive && !isActive) {
      initMouse();
    } else if (!shouldBeActive && isActive) {
      deactivateMouse();
    }
  };

  // Initialiser selon la taille d'écran actuelle
  checkScreenSize();

  // Écouter les changements de taille d'écran
  const handleResize = () => {
    checkScreenSize();
  };

  window.addEventListener('resize', handleResize);

  // Fonction de nettoyage globale
  return () => {
    window.removeEventListener('resize', handleResize);
    deactivateMouse();
  };
}
