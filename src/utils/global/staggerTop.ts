import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Animation stagger pour les éléments avec l'attribut [gsap="stagger-top"]
 * Les éléments apparaissent avec un mouvement Y et un changement d'opacité
 * Compatible avec Barba.js - les ScrollTriggers sont nettoyés automatiquement
 */
export const initStaggerTop = (): void => {
  // Attendre que le DOM soit stable après la transition Barba
  requestAnimationFrame(() => {
    // Sélectionner tous les éléments avec l'attribut gsap="stagger-top"
    const allElements = gsap.utils.toArray<HTMLElement>('[gsap="stagger-top"]');

    if (allElements.length === 0) {
      return;
    }

    // Regrouper les éléments par parent
    const groupsByParent = new Map<HTMLElement, HTMLElement[]>();

    allElements.forEach((element) => {
      const parent = element.parentElement;
      if (parent) {
        if (!groupsByParent.has(parent)) {
          groupsByParent.set(parent, []);
        }
        groupsByParent.get(parent)!.push(element);
      }
    });

    // Créer une animation pour chaque groupe d'éléments
    groupsByParent.forEach((elements, parent) => {
      gsap.from(elements, {
        y: 16 * 4, // Déplacement vertical de 64px vers le haut
        opacity: 0, // Commence invisible
        duration: 0.5,
        ease: 'power2.out',
        stagger: {
          amount: 0.5, // Délai total entre tous les éléments du groupe
          from: 'start', // Commence par le premier élément
        },
        scrollTrigger: {
          markers: false,
          trigger: parent, // Utilise toujours le parent comme trigger
          start: 'top 85%', // Démarre quand le haut du parent atteint 85% de la hauteur du viewport
          toggleActions: 'play none none reverse',
          // Les ScrollTriggers seront automatiquement nettoyés par Barba.js
          // dans le hook beforeLeave (ScrollTrigger.getAll().forEach...)
        },
      });
    });

    // Rafraîchir ScrollTrigger pour recalculer les positions
    ScrollTrigger.refresh();
  });
};

export default initStaggerTop;
