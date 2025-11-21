/*
 *============================================================================
 * COMPONENT : SECTION / WHO (STUDIOS)
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

export function initWhoSlider() {
  const swipers = document.querySelectorAll('.swiper.is-home-studio');

  if (swipers.length === 0) {
    return;
  }

  swipers.forEach((swiperEl) => {
    new Swiper(swiperEl as HTMLElement, {
      direction: 'horizontal',
      loop: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 2 * 16,
      speed: 500,
      //   autoplay: {
      //     delay: 5000,
      //     disableOnInteraction: false,
      //   },
      grabCursor: true,
      allowTouchMove: true,
      keyboard: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true,
        eventsTarget: 'container',
      },
      // pagination: {
      //   el: '.services_component .swiper-pagination-wrapper',
      //   bulletClass: 'swiper-bullet',
      //   bulletActiveClass: 'is-active',
      //   clickable: true,
      // },
      navigation: {
        prevEl: '.home_who_navigation .swiper-left',
        nextEl: '.home_who_navigation .swiper-right',
      },
      touchEventsTarget: 'wrapper',
      breakpoints: {
        992: {
          slidesPerView: 2.5,
        },
        240: {
          slidesPerView: 1.5,
          spaceBetween: 1.5 * 16,
        },
      },
    });
  });
}
