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

  new Swiper(swiperEl as HTMLElement, {
    direction: 'horizontal',
    loop: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 2.5 * 16,
    speed: 500,
    grabCursor: true,
    allowTouchMove: true,
    keyboard: true,
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
      },
    },
  });
}
