import gsap from 'gsap';

export const initServicesParallax = (): void => {
  const card1 = document.querySelector('.home_services_card-1');
  const card2 = document.querySelector('.home_services_card-2');
  const card3 = document.querySelector('.home_services_card-3');
  const cardInner1 = document.querySelector('#first-card');
  const cardInner2 = document.querySelector('#services-card-2');
  const cardInner3 = document.querySelector('#services-card-3');
  //   const card4 = document.querySelector('.home_services_card-4');
  //   const trigger1 = document.querySelector('.home_services_trigger.is-1');
  //   const trigger2 = document.querySelector('.home_services_trigger.is-2');
  //   const trigger3 = document.querySelector('.home_services_trigger.is-3');
  //   const trigger4 = document.querySelector('.home_services_trigger.is-4');
  //   const trigger5 = document.querySelector('.home_services_trigger.is-5');
  //   const trigger6 = document.querySelector('.home_services_trigger.is-6');

  if (!card1) return;

  gsap.fromTo(
    card1,
    {
      y: '0rem',
    },
    {
      y: '-50rem',
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        markers: false,
        trigger: card1,
        start: '100% 100%',
        end: '200% 00%',
        scrub: true,
      },
    }
  );

  if (cardInner1) {
    gsap.fromTo(
      cardInner1,
      {
        scale: 1,
      },
      {
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          markers: false,
          trigger: card1,
          start: '100% 75%',
          end: '200% 00%',
          scrub: true,
        },
      }
    );
  }

  gsap.fromTo(
    card2,
    {
      y: '0rem',
    },
    {
      y: '-50rem',
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        markers: false,
        trigger: card2,
        start: '95% 100%',
        end: '200% 00%',
        scrub: true,
      },
    }
  );

  if (cardInner2) {
    gsap.fromTo(
      cardInner2,
      {
        scale: 1,
      },
      {
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          markers: false,
          trigger: card2,
          start: '100% 75%',
          end: '200% 00%',
          scrub: true,
        },
      }
    );
  }

  gsap.fromTo(
    card3,
    {
      y: '0rem',
    },
    {
      y: '-50rem',
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        markers: false,
        trigger: card3,
        start: '95% 100%',
        end: '200% 00%',
        scrub: true,
      },
    }
  );

  if (cardInner3) {
    gsap.fromTo(
      cardInner3,
      {
        scale: 1,
      },
      {
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          markers: false,
          trigger: card3,
          start: '100% 75%',
          end: '200% 00%',
          scrub: true,
        },
      }
    );
  }

  //   gsap.fromTo(
  //     card4,
  //     {
  //       y: '0rem',
  //     },
  //     {
  //       y: '-25rem',
  //       ease: 'none',
  //       scrollTrigger: {
  //         markers: true,
  //         trigger: card4,
  //         start: '100% 100%',
  //         end: '200% 00%',
  //         scrub: true,
  //       },
  //     }
  //   );
};
