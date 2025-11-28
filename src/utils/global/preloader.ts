import gsap from 'gsap';

/**
 * Preloader qui s'affiche uniquement lors de la première visite
 * Features:
 * - Cache la visite pendant 1 semaine via sessionStorage/localStorage
 * - Affiche un compteur de progression pendant le chargement
 * - Effet de suivi de souris sur .prealoader_cards
 */

const CACHE_KEY = 'nods_first_visit';
// const CACHE_DURATION = 7; // 7s
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semaine en millisecondes

/**
 * Vérifie si c'est la première visite
 */
const isFirstVisit = (): boolean => {
  const cachedVisit = localStorage.getItem(CACHE_KEY);

  if (!cachedVisit) {
    return true;
  }

  try {
    const visitData = JSON.parse(cachedVisit);
    const now = Date.now();

    // Vérifier si le cache est encore valide
    if (now - visitData.timestamp < CACHE_DURATION) {
      return false;
    }

    // Cache expiré, nettoyer
    localStorage.removeItem(CACHE_KEY);
    return true;
  } catch {
    // Si erreur de parsing, considérer comme première visite
    localStorage.removeItem(CACHE_KEY);
    return true;
  }
};

/**
 * Marque la visite comme effectuée
 */
const markVisitComplete = (): void => {
  const visitData = {
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(visitData));
};

/**
 * Anime le compteur de chargement
 */
const animateCounter = async (
  counterElement: HTMLElement,
  onComplete: () => void
): Promise<void> => {
  const MIN_DURATION = 2000; // Durée minimale de 3 secondes
  const startTime = Date.now();

  let currentProgress = 0;
  let isLoading = true;

  // Initialiser le compteur à 0%
  counterElement.textContent = '0%';

  // Fonction pour mettre à jour le compteur
  const updateCounter = () => {
    if (!isLoading) return;

    const elapsedTime = Date.now() - startTime;
    const minProgressByTime = Math.min(95, (elapsedTime / MIN_DURATION) * 95);

    // Calculer le progrès réel
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalResources = resources.length || 1;
    const loadedResources = resources.filter((resource) => resource.responseEnd > 0).length;
    const realProgress = Math.round((loadedResources / totalResources) * 100);

    // Le progrès affiché est le minimum entre le progrès réel et le progrès basé sur le temps
    const targetProgress = Math.min(realProgress, minProgressByTime);

    // Interpoler progressivement vers le progrès cible
    if (currentProgress < targetProgress) {
      // Rattraper le progrès cible
      const increment = Math.max(1, Math.ceil((targetProgress - currentProgress) / 5));
      currentProgress = Math.min(currentProgress + increment, targetProgress);
    } else if (currentProgress < 95 && elapsedTime < MIN_DURATION) {
      // Si on est en avance mais pas encore au temps minimum, incrémenter très doucement
      currentProgress = Math.min(currentProgress + 0.5, 95);
    }

    counterElement.textContent = `${Math.floor(currentProgress)}%`;

    // Continuer l'animation si on n'a pas atteint 100%
    if (currentProgress < 100) {
      setTimeout(updateCounter, 50);
    }
  };

  // Démarrer l'animation immédiatement
  updateCounter();

  // Attendre que la page soit complètement chargée ET que le temps minimum soit écoulé
  await Promise.all([
    new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve(), { once: true });
      }
    }),
    new Promise<void>((resolve) => {
      const remainingTime = Math.max(0, MIN_DURATION - (Date.now() - startTime));
      setTimeout(resolve, remainingTime);
    }),
  ]);

  // Forcer la progression jusqu'à 100%
  const finishCounter = () => {
    return new Promise<void>((resolve) => {
      const finalUpdate = () => {
        if (currentProgress < 100) {
          currentProgress += 2;
          if (currentProgress > 100) currentProgress = 100;
          counterElement.textContent = `${Math.floor(currentProgress)}%`;
          setTimeout(finalUpdate, 30);
        } else {
          isLoading = false;
          resolve();
        }
      };
      finalUpdate();
    });
  };

  await finishCounter();

  // Petit délai avant de terminer
  setTimeout(onComplete, 500);
};

/**
 * Initialise l'effet de suivi de souris sur .prealoader_cards
 */
const initMouseFollow = (cardsElement: HTMLElement): (() => void) => {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId: number | null = null;

  // Fonction de lissage (lerp)
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Obtenir la position de la souris par rapport au centre de la fenêtre
    mouseX = (e.clientX - window.innerWidth / 2) * 0.5; // Multiplier par un facteur pour ajuster l'intensité
    mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
  };

  const animate = () => {
    // Interpolation douce vers la position cible
    currentX = lerp(currentX, mouseX, 0.1);
    currentY = lerp(currentY, mouseY, 0.1);

    // Appliquer la transformation
    gsap.set(cardsElement, {
      x: currentX,
      y: currentY,
    });

    rafId = requestAnimationFrame(animate);
  };

  // Démarrer l'animation
  window.addEventListener('mousemove', handleMouseMove);
  rafId = requestAnimationFrame(animate);

  // Fonction de nettoyage
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
};

/**
 * Anime la sortie du preloader
 */
const animatePreloaderOut = (preloaderElement: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Cacher complètement le preloader
        preloaderElement.style.display = 'none';
        resolve();
      },
    });

    // Animation de sortie similaire à la transition barba
    tl.to(preloaderElement, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    // Optionnel: animation supplémentaire sur les cards
    const cards = preloaderElement.querySelector('.prealoader_cards');
    if (cards) {
      tl.to(
        cards,
        {
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      );
    }
  });
};

/**
 * Initialise le preloader
 */
export const initPreloader = (): void => {
  // Récupérer le preloader immédiatement pour éviter le flash
  const preloaderElement = document.querySelector('.preloader_component') as HTMLElement;

  if (!preloaderElement) {
    // Preloader component not found, skip initialization
    return;
  }

  // Vérifier si c'est la première visite
  const firstVisit = isFirstVisit();

  // Debug temporaire (à retirer après test)
  // eslint-disable-next-line no-console
  console.log('🔍 Preloader Debug - Première visite:', firstVisit);

  if (!firstVisit) {
    // Pas la première visite, cacher le preloader immédiatement (avant toute autre opération)
    preloaderElement.style.display = 'none';
    return;
  }

  // C'est la première visite, afficher le preloader
  const counterElement = document.querySelector('.prealoader_cards-loading-count') as HTMLElement;
  const cardsElement = document.querySelector('.prealoader_cards') as HTMLElement;

  // S'assurer que le preloader est visible (forcer l'affichage)
  preloaderElement.style.setProperty('display', 'flex', 'important');
  preloaderElement.style.opacity = '1';
  gsap.set(preloaderElement, { opacity: 1, display: 'flex' });

  // Initialiser l'effet de suivi de souris si l'élément existe
  let cleanupMouseFollow: (() => void) | null = null;
  if (cardsElement) {
    cleanupMouseFollow = initMouseFollow(cardsElement);
  }

  // Démarrer l'animation du compteur
  if (counterElement) {
    animateCounter(counterElement, async () => {
      // Nettoyage de l'effet de souris
      if (cleanupMouseFollow) {
        cleanupMouseFollow();
      }

      // Animer la sortie du preloader
      await animatePreloaderOut(preloaderElement);

      // Marquer la visite comme complète
      markVisitComplete();
    });
  } else {
    // Counter element not found, fallback: wait for complete load and close
    window.addEventListener('load', async () => {
      if (cleanupMouseFollow) {
        cleanupMouseFollow();
      }
      await animatePreloaderOut(preloaderElement);
      markVisitComplete();
    });
  }
};
