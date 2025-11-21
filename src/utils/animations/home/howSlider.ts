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
        navigation: {
          prevEl: '.home_how_navigation .swiper-left',
          nextEl: '.home_how_navigation .swiper-right',
        },
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
        navigation: {
          prevEl: '.home_how_navigation .swiper-left',
          nextEl: '.home_how_navigation .swiper-right',
        },
      });
    }

    setupSlideText();
  };

  const setupSlideText = () => {
    if (!swiperInstance) return;

    const swiper = swiperInstance;
    const textElement = document.querySelector('.home_how_text') as HTMLElement;

    if (!textElement) return;

    // Add transition CSS
    textElement.style.transition = 'opacity 0.3s ease-out';

    // Slide text mapping
    const slideTexts = ['Company (re)branding', 'Product Design', 'Marketing Campaign'];

    // Function to update text based on active slide with fade effect
    const updateSlideText = (activeIndex: number) => {
      if (slideTexts[activeIndex]) {
        // Fade out
        textElement.style.opacity = '0';

        // Change text after fade out
        setTimeout(() => {
          textElement.textContent = slideTexts[activeIndex];
          // Fade in
          textElement.style.opacity = '1';
        }, 300);
      }
    };

    // Set initial text with fade in animation
    textElement.textContent = slideTexts[swiper.activeIndex];
    textElement.style.opacity = '0';

    // Fade in after a short delay
    setTimeout(() => {
      textElement.style.opacity = '1';
    }, 100);

    // Update text on slide change
    swiper.on('slideChange', () => {
      updateSlideText(swiper.activeIndex);
    });
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
