/*
 *============================================================================
 * COMPONENT : SECTION / HOW
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

export function initOtherProjectsSlider() {
  // Get the parent .swiper element
  const swiperEl = document.querySelector('.swiper.is-projects-other');

  if (!swiperEl) {
    return;
  }

  new Swiper(swiperEl as HTMLElement, {
    direction: 'horizontal',
    // loop: true,
    centeredSlides: true,
    slidesPerView: 3,
    spaceBetween: 3 * 16,
    speed: 1000,
    grabCursor: true,
    allowTouchMove: true,
    keyboard: true,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
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
  });
}
