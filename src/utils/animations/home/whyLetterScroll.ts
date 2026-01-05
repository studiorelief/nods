import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Wraps each word in a span element for individual animation
 */
function wrapWordsInSpan(element: HTMLElement): void {
  const text = element.textContent || '';
  element.innerHTML = text
    .split(' ')
    .map((word) => `<span class="word">${word}</span>`)
    .join(' ');
}

/**
 * Initializes word-by-word scroll animation for the why section heading
 * Each word animates individually with a stagger effect based on scroll progress
 * Note: ScrollTrigger is registered globally in index.ts
 */
export function initWhyLetterScroll(): void {
  const pinHeight = document.querySelector('.section_home_why') as HTMLElement;

  if (!pinHeight) {
    console.error('❌ Section .section_home_why not found');
    return;
  }

  const container = pinHeight.querySelector('.home_why_component') as HTMLElement;
  const paragraph = pinHeight.querySelector('.home_why_heading') as HTMLElement;

  if (!container) {
    console.error('❌ Container .home_why_component not found');
    return;
  }

  if (!paragraph) {
    console.error('❌ Paragraph .home_why_heading not found');
    return;
  }

  // Check if heading has div children (multiple lines structure)
  const divChildren = Array.from(paragraph.children).filter(
    (child) => child.tagName.toLowerCase() === 'div'
  );

  if (divChildren.length > 0) {
    // Process each div as a separate line
    divChildren.forEach((div) => {
      wrapWordsInSpan(div as HTMLElement);
    });
  } else {
    // Original behavior: wrap words directly in the paragraph
    wrapWordsInSpan(paragraph);
  }

  const words = paragraph.querySelectorAll('.word');

  // Pin the container while scrolling through the section
  ScrollTrigger.create({
    markers: true,
    trigger: pinHeight, // We listen to .section_home_why position
    start: 'top top',
    end: 'bottom bottom',
    pin: container, // Progresses with the scroll
  });

  // Organize words into lines based on their vertical position
  const lines: HTMLElement[][] = [[]];
  let lineIndex = 0;

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i] as HTMLElement;
    const { offsetTop } = word;

    // If distance is different from previous word we start a new line
    if (i > 0 && offsetTop !== (words[i - 1] as HTMLElement).offsetTop) {
      // We start a new line
      lines.push([]);
      lineIndex += 1;
    }

    lines[lineIndex].push(word);
  }

  // Animate each line with a stagger effect
  lines.forEach((lineWords) => {
    gsap.to(lineWords, {
      x: 0, // Animate the 'x' property to 0
      stagger: 0.2, // Stagger the animation of each element by 0.2
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: pinHeight, // Element that triggers the animation
        start: 'top 75%', // Start the animation when the top of the trigger hits the top of the viewport
        end: 'bottom bottom', // End the animation when the bottom of the trigger hits the bottom of the viewport
        scrub: true, // Scrub the animation based on scroll position
      },
    });
  });
}
