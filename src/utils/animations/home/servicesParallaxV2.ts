import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initServicesParallaxV2 = (): void => {
  // Only run if screen width is greater than 479px
  if (window.innerWidth <= 479) return;

  const cards = gsap.utils.toArray<HTMLElement>([
    '.home_services_card-1',
    '.home_services_card-2',
    '.home_services_card-3',
    '.home_services_card-4',
    '.home_services_card-5',
    '.home_services_card-6',
    // '.home_services_card-7',
  ]);

  if (cards.length === 0) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      {
        y: '0rem',
        scale: 1,
      },
      {
        y: '-20.125rem',
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: card,
          start: '0% top',
          end: '100% top',
          scrub: true,
          markers: false,
        },
      }
    );
  });

  // Fonction pour rafraîchir ScrollTrigger avec debounce
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  const refreshScrollTrigger = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // ResizeObserver pour détecter les changements de hauteur du document
  // Cela capture tous les changements de taille, y compris ceux causés par les dropdowns
  const resizeObserver = new ResizeObserver(() => {
    refreshScrollTrigger();
  });

  resizeObserver.observe(document.body);
  resizeObserver.observe(document.documentElement);

  // MutationObserver pour détecter les changements de style (display, height, etc.)
  // qui peuvent affecter la hauteur de la page
  const styleObserver = new MutationObserver((mutations) => {
    let shouldRefresh = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const target = mutation.target as HTMLElement;
        // Détecter les changements de style inline (display, height, max-height, etc.)
        if (mutation.attributeName === 'style') {
          const { display, height, maxHeight, visibility, overflow } = target.style;
          // Vérifier si un changement de style peut affecter la hauteur
          if (display || height || maxHeight || visibility || overflow) {
            shouldRefresh = true;
          }
        }
        // Détecter les changements d'attributs qui peuvent indiquer un toggle
        if (
          mutation.attributeName === 'aria-expanded' ||
          mutation.attributeName === 'aria-hidden'
        ) {
          shouldRefresh = true;
        }
      }
    });
    if (shouldRefresh) {
      refreshScrollTrigger();
    }
  });

  // Observer tous les éléments du document pour les changements de style
  styleObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['style', 'aria-expanded', 'aria-hidden'],
    subtree: true,
  });
};
