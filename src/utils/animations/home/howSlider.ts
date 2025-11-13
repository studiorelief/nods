/*
 *============================================================================
 * COMPONENT : SECTION / HOW
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

export function initHowSlider() {
  const swiperWrapper = document.querySelector('.swiper-wrapper.is-how');

  if (!swiperWrapper) {
    return;
  }

  // Get the parent .swiper element
  const swiperEl = swiperWrapper.closest('.swiper');

  if (!swiperEl) {
    return;
  }

  const swiper = new Swiper(swiperEl as HTMLElement, {
    direction: 'horizontal',
    loop: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 2.5 * 16,
    speed: 500,
    grabCursor: true,
    allowTouchMove: true,
    keyboard: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.5,
      releaseOnEdges: true,
      eventsTarget: 'container',
    },
    // pagination: {
    //   el: '.swiper-pagination',
    //   bulletClass: 'swiper-bullet',
    //   bulletActiveClass: 'is-active',
    //   clickable: true,
    // },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
    touchEventsTarget: 'wrapper',
    breakpoints: {
      992: {
        slidesPerView: 'auto',
        centeredSlides: true,
        fadeEffect: {
          crossFade: true,
        },
      },
      240: {
        slidesPerView: 'auto',
        centeredSlides: false,
        freeMode: {
          enabled: true,
          sticky: false,
          momentumRatio: 0.5,
        },
        spaceBetween: 1.5 * 16,
        mousewheel: {
          forceToAxis: true,
          sensitivity: 0.5,
          releaseOnEdges: true,
          eventsTarget: 'container',
        },
        allowTouchMove: false,
      },
    },
  });

  // Add click handlers for triggers
  const trigger1 = document.querySelector('#trigger-1');
  const trigger2 = document.querySelector('#trigger-2');
  const trigger3 = document.querySelector('#trigger-3');

  const triggers = [trigger1, trigger2, trigger3];

  // Function to update active trigger
  const updateActiveTrigger = (activeIndex: number) => {
    triggers.forEach((trigger, index) => {
      if (trigger) {
        if (index === activeIndex) {
          trigger.classList.add('w--current');
        } else {
          trigger.classList.remove('w--current');
        }
      }
    });
  };

  // Set initial active state
  updateActiveTrigger(swiper.activeIndex);

  // Update active trigger on slide change
  swiper.on('slideChange', () => {
    updateActiveTrigger(swiper.activeIndex);
  });

  if (trigger1) {
    trigger1.addEventListener('click', () => {
      swiper.slideTo(0);
    });
  }

  if (trigger2) {
    trigger2.addEventListener('click', () => {
      swiper.slideTo(1);
    });
  }

  if (trigger3) {
    trigger3.addEventListener('click', () => {
      swiper.slideTo(2);
    });
  }
}
