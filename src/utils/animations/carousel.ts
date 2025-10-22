/*
 *============================================================================
 * UNIFIED CAROUSEL UTILITIES (Webflow component + CMS)
 *============================================================================
 */

import 'swiper/css/bundle';

import Swiper from 'swiper/bundle';

type InitOptions = {
  rootSelector: string;
};

const BASE_SPACE = 16 * 1.25;
const PIXELS_PER_SECOND = 1000;

function duplicateUntilWideEnough(root: HTMLElement, wrapper: HTMLElement): void {
  const originalSlides = Array.from(wrapper.children) as HTMLElement[];
  const originalCount = originalSlides.length;
  if (originalCount === 0) return;

  const targetWidth = Math.max(window.innerWidth, root.clientWidth) * 3;
  let safety = 0;
  while (wrapper.scrollWidth < targetWidth && safety < 50) {
    originalSlides.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true) as HTMLElement);
    });
    // force reflow to update scrollWidth
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    wrapper.offsetWidth;
    safety += 1;
  }
}

function computeSpeed(wrapper: HTMLElement): number {
  const totalWidth = wrapper.scrollWidth;
  return Math.max(1000, (totalWidth / PIXELS_PER_SECOND) * 1000);
}

function initLoopSwiperForRoot(root: HTMLElement): void {
  const wrapper = root.querySelector('.swiper-wrapper') as HTMLElement | null;
  if (!wrapper) return;

  duplicateUntilWideEnough(root, wrapper);

  const speed = computeSpeed(wrapper);

  const swiper = new Swiper(root, {
    direction: 'horizontal',
    loop: true,
    centeredSlides: true,
    speed,
    spaceBetween: BASE_SPACE,
    slidesPerView: 'auto',
    autoplay: { delay: 0, reverseDirection: false },
    grabCursor: false,
    allowTouchMove: false,
    mousewheel: false,
    passiveListeners: true,
  });

  // Keep linear timing and resync on resize
  const { wrapperEl } = swiper as unknown as { wrapperEl?: HTMLElement };
  if (wrapperEl) wrapperEl.style.transitionTimingFunction = 'linear';

  swiper.on('resize', (s) => {
    const { wrapperEl: we } = s as unknown as { wrapperEl?: HTMLElement };
    if (we) we.style.transitionTimingFunction = 'linear';
    (s.params as unknown as { speed: number }).speed = computeSpeed(wrapper);
    s.update();
  });
}

export function initLoopWordSwiper(
  options: InitOptions = { rootSelector: '.swiper.is-loop-word' }
): void {
  const swipers = document.querySelectorAll(options.rootSelector);
  if (swipers.length === 0) return;
  swipers.forEach((el) => initLoopSwiperForRoot(el as HTMLElement));
}

export function initLoopStudiosSwiper(
  options: InitOptions = { rootSelector: '.swiper.is-studios-loop' }
): void {
  const swipers = document.querySelectorAll(options.rootSelector);
  if (swipers.length === 0) return;
  swipers.forEach((el) => initLoopSwiperForRoot(el as HTMLElement));
}

export default {
  initLoopWordSwiper,
  initLoopStudiosSwiper,
};
