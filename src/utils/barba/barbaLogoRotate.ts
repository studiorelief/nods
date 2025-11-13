import gsap from 'gsap';

export const barbaLogoRotate = () => {
  const logo = document.body.querySelector('.logo-svg.is-s') as HTMLElement | null;
  if (logo) {
    // Stop any ongoing tweens and normalize starting state
    gsap.killTweensOf(logo);
    gsap.set(logo, { rotationY: 0, transformOrigin: '50% 50%' });

    // Animate to 360°, then snap back to 0° to ensure consistent final state
    gsap.to(logo, {
      rotationY: 360,
      duration: 1,
      ease: 'power2.out',
      transformOrigin: '50% 50%',
      onComplete: () => {
        gsap.set(logo, { rotationY: 0, transformOrigin: '50% 50%' });
      },
    });
  }
};

export const setupLogoHover = () => {
  const logoComponent = document.body.querySelector('.logo-component') as HTMLElement | null;
  const logo = document.body.querySelector('.logo-svg.is-s') as HTMLElement | null;

  if (logoComponent && logo) {
    // Initialize logo with transform origin
    gsap.set(logo, { transformOrigin: '50% 50%' });

    // Hover in
    logoComponent.addEventListener('mouseenter', () => {
      gsap.killTweensOf(logo);
      gsap.to(logo, {
        rotationY: 180,
        duration: 0.4,
        ease: 'power2.out',
        transformOrigin: '50% 50%',
      });
    });

    // Hover out
    logoComponent.addEventListener('mouseleave', () => {
      gsap.killTweensOf(logo);
      gsap.to(logo, {
        rotationY: 0,
        duration: 0.4,
        ease: 'power2.out',
        transformOrigin: '50% 50%',
      });
    });
  }
};
