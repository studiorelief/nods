export const initCardsBorder = () => {
  // Configuration des mappings entre les liens et les bordures
  const tabMappings = [
    { href: '#product-design', borderClass: 'is-product-design' },
    { href: '#company-rebranding', borderClass: 'is-company-rebranding' },
    { href: '#marketing-campaign', borderClass: 'is-marketing-campaign' },
  ];

  // Fonction pour mettre à jour l'état des bordures
  const updateBorderStates = () => {
    tabMappings.forEach(({ href, borderClass }) => {
      // Trouver le lien avec le href correspondant
      const link = document.querySelector(`[href="${href}"]`);
      // Trouver l'élément de bordure correspondant
      const border = document.querySelector(`.pricing_border.${borderClass}`);

      if (link && border) {
        // Si le lien a la classe w--current, retirer is-border-unactive
        if (link.classList.contains('w--current')) {
          border.classList.remove('is-border-unactive');
        } else {
          // Sinon, ajouter is-border-unactive
          border.classList.add('is-border-unactive');
        }
      }
    });
  };

  // Mise à jour initiale
  updateBorderStates();

  // Observer les changements de classe sur tous les liens de tabs
  tabMappings.forEach(({ href }) => {
    const link = document.querySelector(`[href="${href}"]`);

    if (link) {
      // Créer un observer pour surveiller les changements de classe
      const observer = new MutationObserver(() => {
        updateBorderStates();
      });

      // Observer les changements d'attributs (notamment la classe)
      observer.observe(link, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  });
};
