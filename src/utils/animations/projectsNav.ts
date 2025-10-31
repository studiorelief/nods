/*
 *============================================================================
 * COMPONENT : NAV COMPONENT
 *============================================================================
 */

import gsap from 'gsap';

export function initProjectsNav() {
  const navComponent = document.querySelector('.nav_component');

  if (!navComponent) {
    return;
  }

  // Set initial state (hidden above viewport)
  gsap.set(navComponent, {
    yPercent: -100,
    // duration: 1,
    ease: 'power2.out',
  });
}
