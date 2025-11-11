import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a letter element with loop effect (2 copies)
 */
function createLoopLetter(letter: string): HTMLElement {
  const letterContainer = document.createElement('span');
  letterContainer.className = 'letter-container';

  const letterWrapper = document.createElement('span');
  letterWrapper.className = 'letter-wrapper';

  // Create first letter (visible initially)
  const letterSpan1 = document.createElement('span');
  letterSpan1.className = 'letter';
  letterSpan1.textContent = letter;

  // Create second letter (duplicate for loop effect)
  const letterSpan2 = document.createElement('span');
  letterSpan2.className = 'letter';
  letterSpan2.textContent = letter;

  letterWrapper.appendChild(letterSpan1);
  letterWrapper.appendChild(letterSpan2);
  letterContainer.appendChild(letterWrapper);

  return letterContainer;
}

/**
 * Splits text nodes into individual letter spans while preserving existing elements
 */
function splitTextNode(node: Node, parent: HTMLElement): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      // Preserve whitespace
      if (text.length > 0) {
        parent.appendChild(document.createTextNode(text));
      }
      return;
    }

    // Split by words but preserve spaces
    const words = trimmedText.split(/\s+/);

    words.forEach((word, wordIndex) => {
      if (word.length === 0) return;

      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      // Split each word into letters
      const letters = word.split('');
      letters.forEach((letter) => {
        wordSpan.appendChild(createLoopLetter(letter));
      });

      parent.appendChild(wordSpan);

      // Add space after word (except last word)
      if (wordIndex < words.length - 1) {
        parent.appendChild(document.createTextNode(' '));
      }
    });
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Preserve existing elements like .home_projects_star and .home_projects_heart
    const element = node as HTMLElement;
    parent.appendChild(element.cloneNode(true));
  }
}

/**
 * Processes a heading element by splitting text into letters
 * Returns true if processing was successful, false if already processed or element not found
 */
function processHeading(selector: string): boolean {
  const heading = document.querySelector(selector) as HTMLElement;

  if (!heading) {
    return false;
  }

  // Check if already processed
  if (heading.querySelector('.letter-container')) {
    // console.log(`⚠️ ${selector} already processed, skipping...`);
    return false;
  }

  // Store the original child nodes
  const childNodes = Array.from(heading.childNodes);

  // Create a temporary container to build the new structure
  const tempContainer = document.createElement('div');

  // Process each child node
  childNodes.forEach((node) => {
    splitTextNode(node, tempContainer);
  });

  // Replace the heading content with the processed content
  heading.innerHTML = '';
  while (tempContainer.firstChild) {
    heading.appendChild(tempContainer.firstChild);
  }

  return true;
}

/**
 * Initializes letter animation on scroll for headings
 * Letters will animate with yPercent transform based on scroll progress
 * Preserves existing spans like .home_projects_star and .home_projects_heart
 */
export function initWhereProjectsScroll(): void {
  // Process both headings
  const whereProcessed = processHeading('.where_projects_heading');
  const whyProcessed = processHeading('.home_why_heading');

  // Animate .where_projects_heading if processed
  if (whereProcessed) {
    // Set initial position for the letter wrappers
    gsap.set('.where_projects_heading .letter-wrapper', {
      yPercent: -50, // Start at -50% so first letter is visible
    });

    // Animate letter wrappers with ScrollTrigger to create loop effect
    gsap.to('.where_projects_heading .letter-wrapper', {
      yPercent: 0, // Moves to 0%, showing the second letter
      duration: 3,
      ease: 'power1.inOut', // Non-linear motion
      scrollTrigger: {
        markers: false,
        trigger: '.where_projects_heading', // Listens to the heading position
        start: '33.33% bottom', // Animation starts when heading is 33.33% down from bottom
        end: '100% 80%', // Animation ends when heading bottom reaches 80% of viewport
        scrub: 1, // Progresses with the scroll, takes 1s to update
      },
      stagger: {
        each: 0.05, // Delay between each letter animation
        from: 'random', // Randomizes the animation order of letters
      },
    });
  }

  // Animate .home_why_heading if processed
  if (whyProcessed) {
    // Set initial position for the letter wrappers
    gsap.set('.home_why_heading .letter-wrapper', {
      yPercent: -50, // Start at -50% so first letter is visible
    });

    // Animate letter wrappers with ScrollTrigger to create loop effect
    gsap.to('.home_why_heading .letter-wrapper', {
      yPercent: 0, // Moves to 0%, showing the second letter
      duration: 3,
      ease: 'power1.inOut', // Non-linear motion
      scrollTrigger: {
        markers: false,
        trigger: '.home_why_heading', // Listens to the heading position
        start: '33.33% bottom', // Animation starts when heading is 33.33% down from bottom
        end: '100% 80%', // Animation ends when heading bottom reaches 80% of viewport
        scrub: 1, // Progresses with the scroll, takes 1s to update
      },
      stagger: {
        each: 0.05, // Delay between each letter animation
        from: 'random', // Randomizes the animation order of letters
      },
    });
  }
}
