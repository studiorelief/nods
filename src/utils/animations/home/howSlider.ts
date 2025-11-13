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

  let swiperInstance: Swiper | null = null;
  let isDesktopMode = false;

  const initSwiper = () => {
    const isDesktop = window.innerWidth >= 992;

    // Don't reinitialize if mode hasn't changed
    if (swiperInstance && isDesktopMode === isDesktop) {
      return;
    }

    // Destroy existing instance
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
    }

    isDesktopMode = isDesktop;

    if (isDesktop) {
      // Desktop: fade effect
      swiperInstance = new Swiper(swiperEl as HTMLElement, {
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
        touchEventsTarget: 'wrapper',
      });
    } else {
      // Mobile: slide effect with free mode
      swiperInstance = new Swiper(swiperEl as HTMLElement, {
        direction: 'horizontal',
        loop: false,
        centeredSlides: false,
        slidesPerView: 0.4,
        spaceBetween: 1.5 * 16,
        speed: 500,
        grabCursor: true,
        allowTouchMove: true,
        keyboard: true,
        freeMode: {
          enabled: true,
          sticky: false,
          momentum: true,
          momentumRatio: 1,
          momentumVelocityRatio: 1,
        },
        slidesOffsetAfter: 1.5 * 16,
        touchEventsTarget: 'wrapper',
      });
    }

    setupTriggers();
  };

  const setupTriggers = () => {
    if (!swiperInstance) return;

    const swiper = swiperInstance;

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
  };

  // Initialize swiper
  initSwiper();

  // Reinitialize on resize if switching between mobile/desktop
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initSwiper();
    }, 250);
  });
}
