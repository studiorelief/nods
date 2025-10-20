import gsap from 'gsap';

/**
 * Animation des assets de la section Why.
 * Basée sur l'extrait fourni, adaptée aux sélecteurs Webflow.
 *
 * .mwg_effect020 -> .section_home_why
 * .medias img     -> .home_why_medias img
 */
export const whyAssetAnimations = (rootSelector: string = '.section_home_why'): (() => void) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return () => {};

  const root = document.querySelector(rootSelector) as HTMLElement | null;
  if (!root) return () => {};

  if (root.dataset.whyAssetsInited === 'true') return () => {};
  root.dataset.whyAssetsInited = 'true';

  const images: string[] = [];
  root.querySelectorAll<HTMLImageElement>('.home_why_medias img').forEach((image) => {
    const src = image.getAttribute('src');
    if (src) images.push(src);
  });

  if (images.length === 0) {
    root.dataset.whyAssetsInited = 'false';
    return () => {};
  }

  let incr = 0;
  let oldIncrX = 0;
  let oldIncrY = 0;
  let indexImg = 0;
  const resetDist = window.innerWidth / 8;

  const createdImageAttr = 'whyTransientImage';

  const createMedia = (x: number, y: number, deltaX: number, deltaY: number): void => {
    const img = document.createElement('img');
    img.setAttribute('src', images[indexImg]);
    img.style.position = 'absolute';
    img.style.left = '0';
    img.style.top = '0';
    img.style.willChange = 'transform';
    img.dataset[createdImageAttr] = 'true';

    // Positioning context: ensure root can host absolutely positioned children
    const previousPosition = root.style.position;
    if (!previousPosition) {
      const cs = window.getComputedStyle(root);
      if (cs.position === 'static') {
        root.style.position = 'relative';
      }
    }

    root.appendChild(img);

    const tl = gsap.timeline({
      onComplete: () => {
        if (root.contains(img)) root.removeChild(img);
        tl.kill();
      },
    });

    tl.fromTo(
      img,
      {
        xPercent: -50 + (Math.random() - 0.5) * 80,
        yPercent: -50 + (Math.random() - 0.5) * 10,
        scaleX: 1.3,
        scaleY: 1.3,
      },
      {
        scaleX: 1,
        scaleY: 1,
        ease: 'elastic.out(2, 0.6)',
        duration: 0.6,
      }
    );

    tl.fromTo(
      img,
      {
        x,
        y,
        rotation: (Math.random() - 0.5) * 20,
      },
      {
        x: '+=' + deltaX * 4,
        y: '+=' + deltaY * 4,
        rotation: (Math.random() - 0.5) * 20,
        ease: 'power4.out',
        duration: 1.5,
      },
      '<'
    );

    tl.to(img, {
      duration: 0.3,
      scale: 0.5,
      delay: 0.1,
      ease: 'back.in(1.5)',
    });

    indexImg = (indexImg + 1) % images.length;
  };

  const setInitialDelta = (e: MouseEvent): void => {
    oldIncrX = e.clientX;
    oldIncrY = e.clientY;
  };

  const onMouseMove = (e: MouseEvent): void => {
    const valX = e.clientX;
    const valY = e.clientY;

    incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY);

    if (incr > resetDist) {
      incr = 0;
      const rootTop = root.getBoundingClientRect().top;
      createMedia(valX, valY - rootTop, valX - oldIncrX, valY - oldIncrY);
    }

    oldIncrX = valX;
    oldIncrY = valY;
  };

  // Initialise à la première interaction sur la zone
  root.addEventListener('mousemove', setInitialDelta, { once: true, passive: true });
  root.addEventListener('mousemove', onMouseMove, { passive: true });

  const cleanup = (): void => {
    root.removeEventListener('mousemove', onMouseMove);
    // Supprimer les images transitoires créées par l'animation
    root.querySelectorAll(`img[data-${createdImageAttr}="true"]`).forEach((el) => {
      if (root.contains(el)) el.remove();
    });
    root.dataset.whyAssetsInited = 'false';
  };

  return cleanup;
};
export default whyAssetAnimations;
