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

  // Only hide navbar if URL contains /projects/ (project detail page)
  if (window.location.pathname.includes('/projects/')) {
    // Set initial state (hidden above viewport)
    gsap.to(navComponent, {
      yPercent: -100,
      duration: 0.5,
      ease: 'power2.out',
    });
  }
}
