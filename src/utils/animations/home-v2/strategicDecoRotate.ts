import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialise l'animation de rotation sur scroll pour l'élément .home_strategic_decorative
 * Rotation de -360 degrés avec le défilement de la page
 */
export const initStrategicDecoRotate = (): void => {
  const element = document.querySelector('.home_strategic_decorative') as HTMLElement | null;

  if (!element) return;

  gsap.fromTo(
    element,
    {
      rotation: 0,
    },
    {
      rotation: -360,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        markers: false,
      },
    }
  );
};
