import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes the sentence scroll animation effect
 * Creates an infinite horizontal scrolling loop with vertical masking on scroll
 *
 * HTML Structure expected:
 * <div class="pin-height">
 *   <div class="container">
 *     <div class="sentence sentence1">
 *       <p>Get your ticket now... Get your ticket now...</p>
 *     </div>
 *     <div class="sentence sentence2">
 *       <p>Get your ticket now... Get your ticket now...</p>
 *     </div>
 *   </div>
 * </div>
 */
export const initSentenceScroll = (): void => {
  const section = document.querySelector('.section_home_baseline');
  const container = document.querySelector('.section_home_baseline .home_baseline_container');
  const sentence1 = document.querySelector('.is-sentence1');
  const sentence2 = document.querySelector('.is-sentence2');

  // Early return if required elements are not found
  if (!section || !container || !sentence1 || !sentence2) {
    return;
  }

  const sectionEl = section as HTMLElement;

  // Wait for fonts to load before calculating widths
  document.fonts.ready.then(() => {
    const sentence1El = sentence1 as HTMLElement;
    const sentence2El = sentence2 as HTMLElement;

    // Infinite horizontal movement - forward
    gsap.to(sentence1El, {
      x: -sentence1El.clientWidth / 2, // Move by half the width to create seamless loop
      ease: 'none', // Linear movement
      duration: 10,
      repeat: -1, // Infinite repetition
    });

    // Infinite horizontal movement - backward
    gsap.from(sentence2El, {
      x: -sentence2El.clientWidth / 2,
      ease: 'none', // Linear movement
      duration: 10,
      repeat: -1, // Infinite repetition
    });

    // Rotate icons in sentence1 - forward rotation
    const icons1 = document.querySelectorAll(
      '.home_baseline_sentence.is-sentence1 .home_baseline_icon'
    );
    if (icons1.length > 0) {
      gsap.to(icons1, {
        rotation: 360,
        ease: 'none',
        duration: 5,
        repeat: -1,
      });
    }

    // Rotate icons in sentence2 - reverse rotation
    const icons2 = document.querySelectorAll(
      '.home_baseline_sentence.is-sentence2 .home_baseline_icon'
    );
    if (icons2.length > 0) {
      gsap.to(icons2, {
        rotation: -360,
        ease: 'none',
        duration: 5,
        repeat: -1,
      });
    }
  });

  // Vertical masking on scroll - moves both sentences up to reveal/hide
  // Animation starts at 50% of the section scroll
  gsap.to([sentence1, sentence2], {
    yPercent: '-=100', // Move up by 100% of their height
    ease: 'power2.inOut', // Smoother non-linear movement
    scrollTrigger: {
      markers: true,
      trigger: sectionEl,
      start: '10% center', // Starts when section center reaches viewport center (50% of section)
      end: 'center bottom', // Ends when section bottom reaches viewport bottom
      scrub: 2, // Higher value = smoother, more fluid transition
    },
  });
};
