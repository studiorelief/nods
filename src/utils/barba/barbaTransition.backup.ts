import gsap from 'gsap';

/**
 * BACKUP - Ancienne animation de transition
 * Animation de sortie (leave) - Fade out de la page actuelle
 */
export const leaveAnimation = (data: { current: { container: HTMLElement } }) => {
  return gsap.to(data.current.container, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  });
};

/**
 * BACKUP - Ancienne animation de transition
 * Animation d'entrée (enter) - Fade in de la nouvelle page
 */
export const enterAnimation = (data: { next: { container: HTMLElement } }) => {
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
};

/**
 * BACKUP - Call Index
 */
// transitions: [
//     {
//       name: 'opacity-transition',
//       leave(data: { current: { container: HTMLElement } }) {
//         return leaveAnimation(data);
//       },
//       enter(data: { next: { container: HTMLElement } }) {
//         return enterAnimation(data);
//       },
//     },
//   ],
