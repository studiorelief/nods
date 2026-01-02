/*
 *============================================================================
 * COMPONENT : SECTION / MORE WORK
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

// Store the swiper instance to destroy it on subsequent calls
let swiperInstance: Swiper | null = null;

export function initNavbarSlider() {
  // Destroy previous instance if it exists
  if (swiperInstance) {
    try {
      swiperInstance.destroy(true, true);
    } catch (e) {
      console.error('Error destroying swiper:', e);
    }
    swiperInstance = null;
  }

  // Get the parent .swiper element
  const swiperEl = document.querySelector('.swiper.is-navbar');

  if (!swiperEl) {
    return;
  }

  // Clean any remaining swiper artifacts from the DOM
  const wrapper = swiperEl.querySelector('.swiper-wrapper');
  if (wrapper) {
    // Remove any duplicate slides that might have been created by loop mode
    wrapper.querySelectorAll('.swiper-slide-duplicate').forEach((el) => el.remove());
  }

  swiperInstance = new Swiper(swiperEl as HTMLElement, {
    direction: 'horizontal',
    loop: true,
    initialSlide: 1,
    centeredSlides: false,
    spaceBetween: 2 * 16,
    speed: 5000,
    grabCursor: true,
    allowTouchMove: true,
    keyboard: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freeMode: {
      enabled: true,
      momentum: false,
    },
    on: {
      init: function () {
        const wrapper = swiperEl.querySelector('.swiper-wrapper') as HTMLElement;
        if (wrapper) {
          wrapper.style.transitionTimingFunction = 'linear';
        }
      },
      transitionStart: function () {
        const wrapper = swiperEl.querySelector('.swiper-wrapper') as HTMLElement;
        if (wrapper) {
          wrapper.style.transitionTimingFunction = 'linear';
        }
      },
    },
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
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
        spaceBetween: 3 * 16,
      },
      768: {
        slidesPerView: 'auto',
        spaceBetween: 2.5 * 16,
      },
      240: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 2.5 * 16,
      },
    },
  });
}
