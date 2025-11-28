import gsap from 'gsap';

/**
 * Animation de transition "Curved Curtain"
 * Direction: Bas vers Haut (Bottom -> Top)
 *
 * Le rideau monte pour couvrir l'écran (Leave),
 * puis continue de monter (le bas du rideau remonte) pour dévoiler la nouvelle page (Enter).
 */

// --- PATHS POUR LEAVE (Montée) ---
// Ancrés en bas (M 0 100 ... L 0 100 Z)
// La courbe est sur l'arête SUPÉRIEURE.

const leave_start = 'M 0 100 V 100 Q 50 100 100 100 V 100 L 0 100 Z'; // Plat en bas (Caché)
const leave_mid = 'M 0 100 V 50 Q 50 0 100 50 V 100 L 0 100 Z'; // Montagne (En mouvement)
const leave_end = 'M 0 100 V 0 Q 50 0 100 0 V 100 L 0 100 Z'; // Plein écran (Top plat)

// --- PATHS POUR ENTER (Sortie vers le haut) ---
// Ancrés en haut (M 0 0 ... L 0 0 Z)
// La courbe est sur l'arête INFÉRIEURE.
// On switche de path au moment où l'écran est plein.

const enter_start = 'M 0 0 V 100 Q 50 100 100 100 V 0 L 0 0 Z'; // Plein écran (Bottom plat)
const enter_mid = 'M 0 0 V 50 Q 50 100 100 50 V 0 L 0 0 Z'; // Stalactite (En mouvement)
const enter_end = 'M 0 0 V 0 Q 50 0 100 0 V 0 L 0 0 Z'; // Plat en haut (Caché)

export const leaveAnimation = (data: { current: { container: HTMLElement } }) => {
  const tl = gsap.timeline();

  const transitionComponent = document.querySelector('.transition_component') as HTMLElement;
  const path = document.querySelector('.overlay--background') as SVGPathElement;
  const logo = document.querySelector('.transition_logo') as HTMLElement;

  if (!transitionComponent || !path) return tl;

  // 1. Setup
  tl.set(transitionComponent, { display: 'flex', autoAlpha: 1 });
  tl.set(path, { attr: { d: leave_start } }); // Départ du bas

  if (logo) {
    tl.set(logo, { autoAlpha: 0, y: 20 });
  }

  // 2. Montée (Cover)
  tl.to(path, {
    attr: { d: leave_mid },
    duration: 0.4,
    ease: 'power2.in',
  });
  tl.to(path, {
    attr: { d: leave_end },
    duration: 0.3,
    ease: 'power2.out',
  });

  // 3. Logo
  if (logo) {
    tl.to(
      logo,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  // 4. Hide current container (Restore functionality)
  tl.set(data.current.container, { display: 'none' });

  return tl;
};

export const enterAnimation = (data: { next: { container: HTMLElement } }) => {
  const tl = gsap.timeline({
    onComplete: () => {
      const transitionComponent = document.querySelector('.transition_component') as HTMLElement;
      if (transitionComponent) {
        gsap.set(transitionComponent, { display: 'none', autoAlpha: 0 });
      }
      gsap.set(data.next.container, { clearProps: 'all' });
    },
  });

  const path = document.querySelector('.overlay--background') as SVGPathElement;
  const logo = document.querySelector('.transition_logo') as HTMLElement;

  if (!path) return tl;

  // 1. Swap Path (Invisible car les deux sont plein écran)
  tl.set(path, { attr: { d: enter_start } });

  // Scroll to top before revealing the new page
  window.scrollTo(0, 0);

  // 2. Logo Out
  if (logo) {
    tl.to(logo, {
      y: -20,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }

  // 3. Sortie vers le haut (Uncover)
  tl.to(
    path,
    {
      attr: { d: enter_mid },
      duration: 0.3,
      ease: 'power2.in',
    },
    logo ? '>-0.1' : '0'
  );

  tl.to(path, {
    attr: { d: enter_end },
    duration: 0.3,
    ease: 'power2.out',
  });

  return tl;
};
