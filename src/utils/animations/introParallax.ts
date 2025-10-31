import gsap from 'gsap';

export const initIntroParallax = (): void => {
  const trigger = document.querySelector('.section_home_intro');

  if (!trigger) return;

  // Cloud 1 - Y from 10rem to -10rem
  const cloud1 = document.querySelector('.home_intro_cloud-1');
  if (cloud1) {
    gsap.fromTo(
      cloud1,
      {
        y: '-20rem',
      },
      {
        y: '15rem',
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
  const cloud2 = document.querySelector('.home_intro_cloud-2');
  if (cloud2) {
    gsap.fromTo(
      cloud2,
      {
        y: '-15rem',
      },
      {
        y: '10rem',
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
  const cloud3 = document.querySelector('.home_intro_cloud-3');
  if (cloud3) {
    gsap.fromTo(
      cloud3,
      {
        y: '-25rem',
      },
      {
        y: '0rem',
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
