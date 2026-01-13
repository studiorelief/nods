/*
 *============================================================================
 * COMPONENT : SECTION / MORE WORK
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

// Store the swiper instances to destroy them on subsequent calls
const swiperInstances = new Map<HTMLElement, Swiper>();

export function initHomeProjectsSlider() {
  // Destroy previous instances if they exist
  swiperInstances.forEach((instance) => {
    try {
      instance.destroy(true, true);
    } catch (e) {
      console.error('Error destroying swiper:', e);
    }
  });
  swiperInstances.clear();

  // Get all .swiper elements with is-navbar class
  const swiperElements = document.querySelectorAll('.swiper.is-home-projects');

  if (swiperElements.length === 0) {
    return;
  }

  // Initialize each swiper instance
  swiperElements.forEach((swiperEl) => {
    const element = swiperEl as HTMLElement;

    // Clean any remaining swiper artifacts from the DOM
    const wrapper = element.querySelector('.swiper-wrapper');
    if (wrapper) {
      // Remove any duplicate slides that might have been created by loop mode
      wrapper.querySelectorAll('.swiper-slide-duplicate').forEach((el) => el.remove());
    }

    const swiperInstance = new Swiper(element, {
      direction: 'horizontal',
      loop: true,
      initialSlide: 1,
      centeredSlides: false,
      spaceBetween: 2 * 16,
      speed: 5000,
      grabCursor: true,
      allowTouchMove: true,
      // keyboard: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      // freeMode: {
      //   enabled: true,
      //   momentum: false,
      // },
      on: {
        init: function () {
          const wrapper = element.querySelector('.swiper-wrapper') as HTMLElement;
          if (wrapper) {
            wrapper.style.transitionTimingFunction = 'linear';
          }
        },
        transitionStart: function () {
          const wrapper = element.querySelector('.swiper-wrapper') as HTMLElement;
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

    // Store the instance
    swiperInstances.set(element, swiperInstance);
  });
}
