import gsap from 'gsap';

/**
 * Animation de transition inspirée du site Analogue
 * Le logo NODS scale pendant la transition de page
 *
 * Structure DOM:
 * - .transition_component : wrapper fixe
 * - .transition_logo : logo à animer (scale)
 * - .transition_background : background coloré
 */

const DURATION = 0.7; // Même durée que l'ancienne animation

/**
 * Animation de sortie (leave)
 * 1. Affiche le composant de transition
 * 2. Scale up du logo de 0 → 1
 * 3. Fade out de la page actuelle
 */
export const leaveAnimation = (data: { current: { container: HTMLElement } }) => {
  const tl = gsap.timeline();

  const transitionComponent = document.querySelector('.transition_component') as HTMLElement;
  const transitionLogo = document.querySelector('.transition_logo') as HTMLElement;
  const transitionBackground = document.querySelector('.transition_background') as HTMLElement;

  if (!transitionComponent || !transitionLogo) {
    // Fallback si éléments non trouvés
    return gsap.to(data.current.container, {
      opacity: 0,
      duration: DURATION,
      ease: 'power2.out',
    });
  }

  // Afficher le composant de transition
  tl.set(transitionComponent, {
    display: 'flex',
  });

  // État initial du logo et background
  tl.set(transitionLogo, {
    scale: 0,
    opacity: 1,
  });

  if (transitionBackground) {
    tl.set(transitionBackground, {
      y: '100%',
    });

    // Slide up du background
    tl.to(transitionBackground, {
      y: '0%',
      duration: DURATION - 0.1,
      ease: 'power2.out',
      delay: 0.1,
    });
  }

  // Scale up du logo
  tl.to(
    transitionLogo,
    {
      scale: 1,
      duration: DURATION - 0.1,
      ease: 'power2.out',
    },
    0.1
  );

  // Fade out de la page actuelle
  tl.to(
    data.current.container,
    {
      opacity: 0,
      duration: DURATION,
      ease: 'power2.out',
    },
    0
  );

  return tl;
};

/**
 * Animation d'entrée (enter)
 * 1. Fade in de la nouvelle page
 * 2. Scale up du logo jusqu'à disparition
 * 3. Cache le composant de transition
 */
export const enterAnimation = (data: { next: { container: HTMLElement } }) => {
  const transitionComponent = document.querySelector('.transition_component') as HTMLElement;
  const transitionLogo = document.querySelector('.transition_logo') as HTMLElement;
  const transitionBackground = document.querySelector('.transition_background') as HTMLElement;

  if (!transitionComponent || !transitionLogo) {
    // Fallback si éléments non trouvés - même comportement que l'ancienne animation
    gsap.from(data.next.container, {
      opacity: 0,
      duration: DURATION,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(data.next.container, { clearProps: 'all' });
      },
    });
    return;
  }

  // Scale out du logo (continue de grandir puis disparaît)
  gsap.to(transitionLogo, {
    scale: 0,
    opacity: 0,
    duration: DURATION - 0.2,
    ease: 'power2.in',
  });

  // Slide down du background
  if (transitionBackground) {
    gsap.to(transitionBackground, {
      y: '-100%',
      duration: DURATION - 0.1,
      ease: 'power2.in',
      delay: 0.1,
    });
  }

  // Fade in de la nouvelle page - comme l'ancienne animation
  gsap.from(data.next.container, {
    opacity: 0,
    duration: DURATION,
    ease: 'power2.out',
    onComplete: () => {
      // Cacher le composant de transition
      gsap.set(transitionComponent, { display: 'none' });
      // Nettoyer les styles GSAP - crucial pour position: sticky
      gsap.set(data.next.container, { clearProps: 'all' });
    },
  });
};
