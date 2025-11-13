/* Gestion du popup premium avec animations */
import gsap from 'gsap';

export function popupContact() {
  // Sélectionner les éléments nécessaires
  const popupComponent = document.querySelector('[popup="contact"]') as HTMLElement;
  const popupWrapper = document.querySelector('.contact_cards') as HTMLElement;
  const popupBackground = document.querySelector('.contact_background-close') as HTMLElement;
  const triggers = document.querySelectorAll('[trigger="popup-contact"]');
  const navComponent = document.querySelector('.nav_component') as HTMLElement;

  if (!popupComponent || !popupWrapper || !popupBackground) {
    // console.warn('Éléments popup premium non trouvés');
    return;
  }

  // Variable pour stocker l'état de la navbar avant l'ouverture du popup
  let navWasHidden = false;

  // Fonction pour ouvrir le popup
  function openPopup() {
    // Empêcher le scroll de la page
    document.body.style.overflow = 'hidden';

    // Vérifier si la navbar est cachée (sur les pages projets)
    if (navComponent) {
      const styles = window.getComputedStyle(navComponent);
      const { transform } = styles;
      // Si la navbar a une transformation (elle est cachée)
      if (transform !== 'none') {
        navWasHidden = true;
        // Remettre temporairement la navbar à sa position normale
        gsap.to(navComponent, {
          yPercent: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    }

    // Réinitialiser les styles
    popupComponent.style.display = 'flex';
    popupComponent.style.opacity = '0';
    popupWrapper.style.opacity = '0';
    popupBackground.style.opacity = '0';
    popupWrapper.style.transform = 'translateY(2rem)';

    // Ajouter les transitions
    popupComponent.style.transition = 'opacity 0.3s ease-out';
    popupWrapper.style.transition = 'opacity 0.6s ease-out, transform 0.3s ease-out';
    popupBackground.style.transition = 'opacity 0.6s ease-out';

    // Déclencher les animations
    requestAnimationFrame(() => {
      popupComponent.style.opacity = '1';
      popupWrapper.style.opacity = '1';
      popupBackground.style.opacity = '1';
      popupWrapper.style.transform = 'translateY(0rem)';
    });
  }

  // Fonction pour fermer le popup
  function closePopup() {
    // Ajouter les transitions de fermeture
    popupComponent.style.transition = 'opacity 0.3s ease-out';
    popupWrapper.style.transition = 'transform 0.3s ease-out';
    popupBackground.style.transition = 'opacity 0.6s ease-out';

    // Déclencher les animations de fermeture
    popupComponent.style.opacity = '0';
    popupWrapper.style.transform = 'translateY(0rem)';

    // Masquer complètement le popup après 0.3s
    setTimeout(() => {
      popupComponent.style.display = 'none';
      // Réactiver le scroll de la page
      document.body.style.overflow = '';

      // Remettre la navbar à son état caché si elle l'était avant (pages projets)
      if (navWasHidden && navComponent && window.location.pathname.includes('/projects/')) {
        gsap.to(navComponent, {
          yPercent: -100,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
      navWasHidden = false;
    }, 300);
  }

  // Ajouter les événements de clic sur les triggers
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  // Ajouter l'événement de clic sur le background pour fermer
  popupBackground.addEventListener('click', (e) => {
    e.preventDefault();
    closePopup();
  });
}
