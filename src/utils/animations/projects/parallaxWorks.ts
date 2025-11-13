import gsap from 'gsap';

// Store matchMedia instances to clean them up properly
let heroMatchMedia: gsap.MatchMedia | null = null;
let contentMatchMedia: gsap.MatchMedia | null = null;

export const initWorksParallax = (): void => {
  // Clean up previous instances
  if (heroMatchMedia) {
    heroMatchMedia.kill();
    heroMatchMedia = null;
  }
  if (contentMatchMedia) {
    contentMatchMedia.kill();
    contentMatchMedia = null;
  }

  const heroSection = document.querySelector('.projets_hero_background');
  const heroLogo = document.querySelector('.projects_hero_logo');

  if (heroSection) {
    // Reset inline styles before animating
    gsap.set([heroSection, heroLogo], { clearProps: 'all' });

    heroMatchMedia = gsap.matchMedia();

    heroMatchMedia.add(
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
    // Reset inline styles before animating
    gsap.set(contentParallax, { clearProps: 'all' });

    contentMatchMedia = gsap.matchMedia();

    contentMatchMedia.add(
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
              markers: false,
              trigger: '.projects_content_main-parallax',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    );
  }
};
