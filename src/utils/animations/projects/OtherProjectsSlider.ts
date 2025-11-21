/*
 *============================================================================
 * COMPONENT : SECTION / MORE WORK
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

// Store the swiper instance to destroy it on subsequent calls
let swiperInstance: Swiper | null = null;

export function initOtherProjectsSlider() {
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
  const swiperEl = document.querySelector('.swiper.is-projects-other');

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
    slidesPerView: 4,
    spaceBetween: 3 * 16,
    speed: 1000,
    grabCursor: true,
    allowTouchMove: true,
    keyboard: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
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
        slidesPerView: 4,
        spaceBetween: 3 * 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 2.5 * 16,
      },
      240: {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 2.5 * 16,
      },
    },
  });
}
