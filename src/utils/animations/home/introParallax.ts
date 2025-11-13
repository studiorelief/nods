import gsap from 'gsap';

export const initIntroParallax = (): void => {
  const trigger = document.querySelector('.section_home_intro');

  if (!trigger) return;

  // Cloud 1 - Y from 10rem to -10rem
  const isMobile = window.innerWidth < 991;

  const cloud1 = document.querySelector('.home_intro_cloud-decorative-loop.is-1');
  if (cloud1) {
    const fromY = isMobile ? `${40 / 4}rem` : '20rem';
    const toY = isMobile ? `${-50 / 4}rem` : '-250rem';

    gsap.fromTo(
      cloud1,
      {
        y: fromY,
      },
      {
        y: toY,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  // Cloud 2 - Y from 7.5rem to -7.5rem
  const cloud2 = document.querySelector('.home_intro_cloud-decorative-loop.is-2');
  if (cloud2) {
    const fromY2 = isMobile ? `${40 / 4}rem` : '20rem';
    const toY2 = isMobile ? `${-40 / 4}rem` : '-20rem';

    gsap.fromTo(
      cloud2,
      {
        y: fromY2,
      },
      {
        y: toY2,
        ease: 'none',

        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  // Cloud 3 - Y from 5rem to -5rem
  const cloud3 = document.querySelector('.home_intro_cloud-decorative-loop.is-3');
  if (cloud3) {
    const fromY3 = isMobile ? `${30 / 4}rem` : '30rem';
    const toY3 = isMobile ? `${-30 / 4}rem` : '-30rem';

    gsap.fromTo(
      cloud3,
      {
        y: fromY3,
      },
      {
        y: toY3,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  const background = document.querySelector('.home_intro_background');
  if (background) {
    const fromYBg = isMobile ? `${-25 / 4}rem` : '-25rem';
    const toYBg = isMobile ? `${25 / 4}rem` : '25rem';

    gsap.fromTo(
      background,
      {
        y: fromYBg,
      },
      {
        y: toYBg,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }
};
