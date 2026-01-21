import gsap from 'gsap';

export const initServicesParallaxV2 = (): void => {
  // Only run if screen width is greater than 479px
  if (window.innerWidth <= 479) return;

  const cards = gsap.utils.toArray<HTMLElement>([
    '.home_services_card-1',
    '.home_services_card-2',
    '.home_services_card-3',
    '.home_services_card-4',
    '.home_services_card-5',
    '.home_services_card-6',
    // '.home_services_card-7',
  ]);

  if (cards.length === 0) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      {
        y: '0rem',
        scale: 1,
      },
      {
        y: '-20.125rem',
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: card,
          start: '0% top',
          end: '100% top',
          scrub: true,
          markers: false,
        },
      }
    );
  });
};
