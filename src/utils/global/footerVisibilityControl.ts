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

  sectionsToHide.forEach((selector) => {
    const element = footerSection.querySelector(selector) as HTMLElement;
    if (element) {
      if (isHomePage) {
        // Sur la page d'accueil, afficher l'élément
        // Utiliser removeProperty pour laisser le CSS gérer le display par défaut
        // ou mettre flex si nécessaire
        if (element.style.display === 'none') {
          element.style.removeProperty('display');
          // Si l'élément n'a pas de display par défaut dans le CSS, forcer flex
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle.display === 'none') {
            element.style.display = 'flex';
          }
        }
      } else {
        // Sur les autres pages, masquer l'élément
        element.style.display = 'none';
      }
    }
  });
};
