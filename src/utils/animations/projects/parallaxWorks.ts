import gsap from 'gsap';

// Store matchMedia instances to clean them up properly
let heroMatchMedia: gsap.MatchMedia | null = null;
let contentMatchMedia: gsap.MatchMedia | null = null;
let videoMatchMedia: gsap.MatchMedia | null = null;

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
  if (videoMatchMedia) {
    videoMatchMedia.kill();
    videoMatchMedia = null;
  }

  // Try multiple possible class names
  const heroSection =
    document.querySelector('.projets_hero_background') ||
    document.querySelector('.projects_hero_background') ||
    document.querySelector('[class*="hero_background"]');
  const heroLogo =
    document.querySelector('.projects_hero_logo') || document.querySelector('[class*="hero_logo"]');
  const heroTrigger =
    document.querySelector('.section_projects_hero') ||
    document.querySelector('.section-projects-hero') ||
    document.querySelector('[class*="projects_hero"]') ||
    document.querySelector('[class*="section_projects"]');

  // Debug logs
  console.error('[ParallaxWorks] heroSection:', heroSection);
  console.error('[ParallaxWorks] heroLogo:', heroLogo);
  console.error('[ParallaxWorks] heroTrigger:', heroTrigger);

  // Log all elements with "hero" in class name for debugging
  if (!heroSection || !heroTrigger) {
    const allHeroElements = document.querySelectorAll('[class*="hero"]');
    console.error(
      '[ParallaxWorks] All elements with "hero" in class:',
      Array.from(allHeroElements).map((el) => el.className)
    );
  }

  if (heroSection && heroTrigger) {
    // Set initial state before animating to avoid visual glitches
    // Don't clear all props as it can cause jumps if page is already visible
    gsap.set(heroSection, { y: '0rem' });
    if (heroLogo) {
      gsap.set(heroLogo, { y: '0rem' });
    }

    heroMatchMedia = gsap.matchMedia();

    heroMatchMedia.add(
      {
        isMobile: '(max-width: 991px)',
        isDesktop: '(min-width: 992px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        // Different values for mobile and desktop
        const yValue = isMobile ? '8rem' : '12rem';

        // Animation pour heroSection
        const animation = gsap.fromTo(
          heroSection,
          {
            y: '0rem',
          },
          {
            y: yValue,
            ease: 'none',
            scrollTrigger: {
              trigger: heroTrigger,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              markers: false,
            },
          }
        );

        console.error('[ParallaxWorks] Animation created:', animation);
        console.error('[ParallaxWorks] ScrollTrigger:', animation.scrollTrigger);

        // Animation parallaxe séparée pour le logo : y0 à y5rem
        if (heroLogo) {
          gsap.fromTo(
            heroLogo,
            {
              y: '0rem',
            },
            {
              y: '15rem',
              ease: 'none',
              scrollTrigger: {
                trigger: heroTrigger,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                markers: false,
              },
            }
          );
        }
      }
    );
  } else {
    console.error('[ParallaxWorks] Missing elements:', {
      heroSection: !!heroSection,
      heroTrigger: !!heroTrigger,
    });
  }

  // Animation 2: parallaxe sur le bloc contenu
  const contentParallax = document.querySelector('.projects_content_main-parallax');
  const contentTrigger = document.querySelector('.section_projects_content');

  if (contentParallax && contentTrigger) {
    contentMatchMedia = gsap.matchMedia();

    contentMatchMedia.add(
      {
        isMobile: '(max-width: 991px)',
        isDesktop: '(min-width: 992px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };

        if (isMobile) {
          // MOBILE (& small mobile) : l'image fait ~200vw
          // On démarre à 0 (on voit le premier 100vw) et on slide les 100vw restants vers la gauche
          const xStartPercent = 0;
          const xEndPercent = -50;

          gsap.fromTo(
            contentParallax,
            {
              xPercent: xStartPercent,
            },
            {
              xPercent: xEndPercent,
              ease: 'none',
              scrollTrigger: {
                markers: false,
                trigger: '.projects_content_main',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        } else {
          // DESKTOP : garder l’ancienne parallaxe verticale
          gsap.fromTo(
            contentParallax,
            {
              y: '-5rem',
            },
            {
              y: '5rem',
              ease: 'none',
              scrollTrigger: {
                markers: false,
                trigger: '.projects_content_main',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }
    );
  }

  // Animation 3: Video section animation
  const videoWrapper = document.querySelector('.projects_content_video_wrapper');
  const videoDescription = document.querySelector('.projects_content_video_description');
  const videoTrigger = document.querySelector('.projects_content_video');

  if (videoWrapper && videoDescription && videoTrigger) {
    // Set initial state
    gsap.set(videoWrapper, { y: '10rem', opacity: 0 });
    gsap.set(videoDescription, { x: '0rem', opacity: 0 });

    videoMatchMedia = gsap.matchMedia();

    videoMatchMedia.add(
      {
        isMobile: '(max-width: 991px)',
        isDesktop: '(min-width: 992px)',
      },
      () => {
        // Animation for wrapper: y 10rem to 0rem + opacity 0 to 1
        gsap.fromTo(
          videoWrapper,
          {
            y: '10rem',
            opacity: 0,
          },
          {
            y: '0rem',
            opacity: 1,
            ease: 'power2.out',
            duration: 1,
            scrollTrigger: {
              trigger: videoTrigger,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
              markers: false,
            },
          }
        );

        // Animation for description: x 0rem to 0rem + opacity 0 to 1
        gsap.fromTo(
          videoDescription,
          {
            x: '10rem',
            opacity: 0,
          },
          {
            x: '0rem',
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: videoTrigger,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
              markers: false,
            },
          }
        );
      }
    );
  }
};
