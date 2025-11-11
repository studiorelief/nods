import gsap from 'gsap';

export const initWorksParallax = (): void => {
  const heroSection = document.querySelector('.projets_hero_background');
  const heroLogo = document.querySelector('.projects_hero_logo');

  if (heroSection) {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 991px)',
        isDesktop: '(min-width: 992px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const yValue = isMobile ? '10rem' : '10rem';

        gsap.fromTo(
          [heroSection, heroLogo],
          {
            y: '0rem',
          },
          {
            y: yValue,
            ease: 'none',
            scrollTrigger: {
              trigger: '.section_projects_hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    );
  }

  // Animation 2: .projects_content_main-parallax avec trigger .section_projects_content
  const contentParallax = document.querySelector('.projects_content_main-parallax');
  const contentTrigger = document.querySelector('.section_projects_content');

  if (contentParallax && contentTrigger) {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 991px)',
        isDesktop: '(min-width: 992px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const yStartValue = isMobile ? '0rem' : '-5rem';
        const yEndValue = isMobile ? '0em' : '5rem';

        gsap.fromTo(
          contentParallax,
          {
            y: yStartValue,
          },
          {
            y: yEndValue,
            ease: 'none',
            scrollTrigger: {
              trigger: '.projects_content_main-parallax',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    );
  }
};
