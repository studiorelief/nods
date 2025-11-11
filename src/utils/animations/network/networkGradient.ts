/**
 * Version simplifiée pour extraire les couleurs de background et créer un gradient
 * Spécifiquement conçue pour Webflow
 */

export const initNetworkGradiant = (): void => {
  const extractGradient = (): void => {
    // Trouver TOUS les conteneurs de gradient
    const gradientContainers = document.querySelectorAll('.network_cards-background-gradient');

    if (gradientContainers.length === 0) {
      return;
    }

    // Traiter chaque conteneur individuellement
    gradientContainers.forEach((container) => {
      // Chercher les éléments source DANS ce conteneur spécifique
      const element1 = container.querySelector('.network_cards-background.is-1') as HTMLElement;
      const element2 = container.querySelector('.network_cards-background.is-2') as HTMLElement;

      if (!element1 || !element2) {
        return;
      }

      // Fonction pour extraire la couleur
      const getColor = (element: HTMLElement): string => {
        const style = window.getComputedStyle(element);

        // Essayer d'abord backgroundColor
        if (
          style.backgroundColor &&
          style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          style.backgroundColor !== 'transparent'
        ) {
          return style.backgroundColor;
        }

        // Si c'est un gradient, extraire la première couleur
        if (style.backgroundImage && style.backgroundImage !== 'none') {
          const gradientMatch = style.backgroundImage.match(/linear-gradient\([^)]*\)/);
          if (gradientMatch) {
            const colors = gradientMatch[0].match(/(?:rgb|rgba|hsl|hsla|#[0-9a-fA-F]{3,6})/g);
            if (colors && colors.length > 0) {
              return colors[0];
            }
          }
        }

        return '#000000'; // Fallback
      };

      const color1 = getColor(element1);
      const color2 = getColor(element2);

      // Convertir en hex si nécessaire
      const rgbToHex = (rgb: string): string => {
        if (rgb.startsWith('#')) return rgb;

        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }

        return rgb;
      };

      const hexColor1 = rgbToHex(color1);
      const hexColor2 = rgbToHex(color2);

      // Appliquer le gradient sur le conteneur lui-même
      (container as HTMLElement).style.background =
        `linear-gradient(180deg, ${hexColor1} 0%, ${hexColor2} 100%)`;
    });
  };

  // Essayer immédiatement
  extractGradient();

  // Observer les changements de DOM
  const observer = new MutationObserver(() => {
    extractGradient();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
