/**
 * Contrôle la visibilité de certaines sections du footer
 * Masque les sections sur toutes les pages sauf la page d'accueil (home-v2)
 */
export const controlFooterVisibility = (namespace: string): void => {
  const footerSection = document.querySelector('.section_footer-2') as HTMLElement;

  if (!footerSection) return;

  const sectionsToHide = [
    '.footer-2_description',
    '.section_loop-word.is-dragon.is-footer',
    '.footer-2_scroll',
  ];

  const isHomePage = namespace === 'home-v2';
  const isMobile = window.innerWidth < 479;

  sectionsToHide.forEach((selector) => {
    const element = footerSection.querySelector(selector) as HTMLElement;
    if (element) {
      // Si c'est footer-2_scroll et que l'écran est < 479px, toujours le masquer
      if (selector === '.footer-2_scroll' && isMobile) {
        element.style.display = 'none';
        return;
      }

      if (isHomePage) {
        // Sur la page d'accueil, forcer l'affichage de l'élément
        // Retirer d'abord le style inline s'il existe
        element.style.removeProperty('display');

        // Vérifier le computed style après avoir retiré le style inline
        const computedStyle = window.getComputedStyle(element);

        // Si l'élément est toujours caché (par CSS, media query, etc.), forcer l'affichage
        if (computedStyle.display === 'none') {
          // Forcer l'affichage avec flex (ou block selon le contexte)
          element.style.display = 'flex';
        }
      } else {
        // Sur les autres pages, masquer l'élément
        element.style.display = 'none';
      }
    }
  });
};
