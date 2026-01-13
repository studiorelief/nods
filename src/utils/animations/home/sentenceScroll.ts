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
 *     <div class="sentence sentence3">
 *       <p>Get your ticket now... Get your ticket now...</p>
 *     </div>
 *     <div class="sentence sentence4">
 *       <p>Get your ticket now... Get your ticket now...</p>
 *     </div>
 *   </div>
 * </div>
 *
 * Note: sentence1 and sentence3 have the same effect (forward movement)
 *       sentence2 and sentence4 have the same effect (backward movement)
 */
export const initSentenceScroll = (): void => {
  const section = document.querySelector('.section_home_baseline');
  const container = document.querySelector('.home_baseline_container');
  const sentence1 = document.querySelector('.is-sentence1');
  const sentence2 = document.querySelector('.is-sentence2');
  const sentence3 = document.querySelector('.is-sentence3');
  const sentence4 = document.querySelector('.is-sentence4');

  // Early return if required elements are not found
  if (!section || !container || !sentence1 || !sentence2 || !sentence3 || !sentence4) {
    return;
  }

  const containerEl = container as HTMLElement;

  // Initialize positions for sentences using yPercent
  // sentence1: visible initially (yPercent: 0)
  gsap.set(sentence1, { yPercent: 0 });
  // sentence2: hidden below (yPercent: 100%)
  gsap.set(sentence2, { yPercent: 0 });
  // sentence3: hidden below (yPercent: 100%)
  gsap.set(sentence3, { yPercent: 0 });
  // sentence4: hidden below (yPercent: 100%)
  gsap.set(sentence4, { yPercent: 0 });

  // Helper function to duplicate child elements for seamless marquee loop
  const duplicateContent = (element: HTMLElement, copies: number = 3): void => {
    // Check if already duplicated
    if (element.dataset.duplicated === 'true') {
      return;
    }

    // Get all direct children
    const children = Array.from(element.children) as HTMLElement[];

    if (children.length === 0) {
      return;
    }

    // Clone and append children for seamless loop
    for (let i = 0; i < copies; i++) {
      children.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        element.appendChild(clone);
      });
    }

    // Mark as duplicated
    element.dataset.duplicated = 'true';
  };

  // Wait for fonts to load and ensure layout is ready before calculating widths
  document.fonts.ready.then(() => {
    const sentence1El = sentence1 as HTMLElement;
    const sentence2El = sentence2 as HTMLElement;
    const sentence3El = sentence3 as HTMLElement;
    const sentence4El = sentence4 as HTMLElement;

    // Duplicate content for each sentence to create seamless marquee
    duplicateContent(sentence1El, 3);
    duplicateContent(sentence2El, 3);
    duplicateContent(sentence3El, 3);
    duplicateContent(sentence4El, 3);

    // Force a reflow to ensure accurate width calculations after duplication
    void containerEl.offsetHeight;

    // Helper function to calculate the width of one set of original children
    const getOriginalWidth = (element: HTMLElement): number => {
      const children = Array.from(element.children) as HTMLElement[];
      if (children.length === 0) {
        return element.offsetWidth;
      }

      // We duplicated 3 times, so original count is total / 4 (original + 3 copies)
      const totalChildren = children.length;
      const originalCount = Math.floor(totalChildren / 4);
      const firstSet = children.slice(0, originalCount);

      // Calculate width of first set (original content)
      let width = 0;
      firstSet.forEach((child) => {
        width += child.offsetWidth;
      });

      return width;
    };

    // Calculate the width of one set (original content before duplication)
    const originalWidth1 = getOriginalWidth(sentence1El);
    const originalWidth2 = getOriginalWidth(sentence2El);
    const originalWidth3 = getOriginalWidth(sentence3El);
    const originalWidth4 = getOriginalWidth(sentence4El);

    // Infinite horizontal movement - forward (sentence1 and sentence3)
    // Move by exactly one original set width, then loop seamlessly
    gsap.set(sentence1El, { x: 0 });
    gsap.to(sentence1El, {
      x: -originalWidth1,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    gsap.set(sentence3El, { x: 0 });
    gsap.to(sentence3El, {
      x: -originalWidth3,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    // Infinite horizontal movement - backward (sentence2 and sentence4)
    // Start from -originalWidth and move to 0, then loop seamlessly
    gsap.set(sentence2El, { x: -originalWidth2 });
    gsap.to(sentence2El, {
      x: 0,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    gsap.set(sentence4El, { x: -originalWidth4 });
    gsap.to(sentence4El, {
      x: 0,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    // Rotate icons in sentence1 and sentence3 - forward rotation
    const icons4 = document.querySelectorAll('.home_baseline_icon');
    if (icons4.length > 0) {
      gsap.to(icons4, {
        rotation: -360,
        ease: 'none',
        duration: 5,
        repeat: -1,
      });
    }
  });

  // Container movement: automatic loop every 2 seconds
  // Sequence: Sentence 1 -> Sentence 2 -> Sentence 3 -> Sentence 4 -> Sentence 1 (loop)
  const containerTimeline = gsap.timeline({
    repeat: -1, // Infinite loop
  });

  // Start at sentence 1 (y: 0)
  gsap.set(containerEl, { y: '0rem' });

  // Transition to sentence 2 (y: -10rem) - 2 seconds
  containerTimeline.to(containerEl, {
    y: '-10rem',
    ease: 'power4.inOut',
    duration: 2,
  });

  // Transition to sentence 3 (y: -20rem) - 2 seconds
  containerTimeline.to(containerEl, {
    y: '-20rem',
    ease: 'power4.inOut',
    duration: 2,
  });

  // Transition to sentence 4 (y: -30rem) - 2 seconds
  containerTimeline.to(containerEl, {
    y: '-30rem',
    ease: 'power4.inOut',
    duration: 2,
  });

  // Return to sentence 1 (y: 0) - 2 seconds, then loop
  containerTimeline.to(containerEl, {
    y: '0rem',
    ease: 'power4.inOut',
    duration: 2,
  });

  // sentence2: appears at 30% scroll (from 100% to 0), disappears at 50%
  // gsap.fromTo(
  //   sentence2,
  //   { yPercent: 100 }, // Start position (hidden below)
  //   {
  //     yPercent: 0, // Visible position (centered)
  //     ease: 'power2.inOut',
  //     scrollTrigger: {
  //       markers: false,
  //       trigger: containerEl,
  //       start: '30% center',
  //       end: '40% center',
  //       scrub: 2,
  //     },
  //   }
  // );

  // gsap.to(sentence2, {
  //   yPercent: -100, // Move up by 100% to hide sentence2
  //   ease: 'power2.inOut',
  //   scrollTrigger: {
  //     markers: false,
  //     trigger: containerEl,
  //     start: '50% center',
  //     end: '60% center',
  //     scrub: 2,
  //   },
  // });

  // // sentence3: appears at 50% scroll (from 100% to 0), disappears at 70%
  // gsap.fromTo(
  //   sentence3,
  //   { yPercent: 100 }, // Start position (hidden below)
  //   {
  //     yPercent: 0, // Visible position (centered)
  //     ease: 'power2.inOut',
  //     scrollTrigger: {
  //       markers: false,
  //       trigger: containerEl,
  //       start: '50% center',
  //       end: '60% center',
  //       scrub: 2,
  //     },
  //   }
  // );

  // gsap.to(sentence3, {
  //   yPercent: -100, // Move up by 100% to hide sentence3
  //   ease: 'power2.inOut',
  //   scrollTrigger: {
  //     markers: false,
  //     trigger: containerEl,
  //     start: '70% center',
  //     end: '80% center',
  //     scrub: 2,
  //   },
  // });

  // // sentence4: appears at 70% scroll (from 100% to 0), stays visible
  // gsap.fromTo(
  //   sentence4,
  //   { yPercent: 100 }, // Start position (hidden below)
  //   {
  //     yPercent: 0, // Visible position (centered)
  //     ease: 'power2.inOut',
  //     scrollTrigger: {
  //       markers: false,
  //       trigger: containerEl,
  //       start: '70% center',
  //       end: '80% center',
  //       scrub: 2,
  //     },
  //   }
  // );
};
