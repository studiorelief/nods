import gsap from 'gsap';

export const initWorksParallax = (): void => {
  const heroSection = document.querySelector('.projets_hero_background');
  const heroLogo = document.querySelector('.projects_hero_logo');

  if (heroSection) {
    gsap.fromTo(
      [heroSection, heroLogo],
      {
        y: '0rem',
      },
      {
        y: '10rem',
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

  // Animation 2: .projects_content_main-parallax avec trigger .section_projects_content
  const contentParallax = document.querySelector('.projects_content_main-parallax');
  const contentTrigger = document.querySelector('.section_projects_content');

  if (contentParallax && contentTrigger) {
    gsap.fromTo(
      contentParallax,
      {
        y: '-15rem',
      },
      {
        y: '15rem',
        ease: 'none',
        scrollTrigger: {
          trigger: '.section_projects_content',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }
};
