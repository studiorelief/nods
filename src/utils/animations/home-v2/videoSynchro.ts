// Stockage des timeouts et event listeners pour le nettoyage
const videoSynchroCleanups: Array<() => void> = [];
const videoSynchroTimeouts: number[] = [];

/**
 * Nettoie toutes les synchronisations vidéo précédentes
 */
export const cleanupVideoSynchro = (): void => {
  // Nettoyer tous les timeouts
  videoSynchroTimeouts.forEach((timeoutId) => {
    window.clearTimeout(timeoutId);
  });
  videoSynchroTimeouts.length = 0;

  // Exécuter toutes les fonctions de nettoyage
  videoSynchroCleanups.forEach((cleanup) => {
    cleanup();
  });
  videoSynchroCleanups.length = 0;
};

export const initVideoSynchro = (): void => {
  // Nettoyer les synchronisations précédentes avant d'en créer de nouvelles
  cleanupVideoSynchro();

  // Chercher TOUS les wrappers dans le document (dans et hors du container Barba)
  const wrappers = document.querySelectorAll('.loop-word_dragon-wrapper');

  if (wrappers.length === 0) return;

  const maxWaitMs = 5000;

  const initWrapperVideos = (wrapper: Element) => {
    const videos = Array.from(wrapper.querySelectorAll('video')) as HTMLVideoElement[];

    if (videos.length === 0) return;

    let readyCount = 0;
    let started = false;
    let syncIntervalId: number | null = null;
    let isResyncing = false;
    const videoEventListeners: Array<{
      video: HTMLVideoElement;
      event: string;
      handler: () => void;
    }> = [];

    // Vidéo de référence pour la synchronisation (la première)
    const getMasterVideo = (): HTMLVideoElement | null => {
      return (
        videos.find((v) => !v.paused && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ||
        videos[0] ||
        null
      );
    };

    const resyncAllVideos = () => {
      if (isResyncing) return;
      isResyncing = true;

      const master = getMasterVideo();
      if (!master) {
        isResyncing = false;
        return;
      }

      const masterTime = master.currentTime;

      videos.forEach((video) => {
        if (video === master) return;

        try {
          // Si la différence est supérieure à 0.1 seconde, on resynchronise
          const timeDiff = Math.abs(video.currentTime - masterTime);
          if (timeDiff > 0.1) {
            video.currentTime = masterTime;
          }
        } catch {
          // Ignore les erreurs de synchronisation
        }
      });

      isResyncing = false;
    };

    const startSyncLoop = () => {
      // Arrêter l'intervalle précédent s'il existe
      if (syncIntervalId !== null) {
        window.clearInterval(syncIntervalId);
      }

      // Synchroniser toutes les 100ms pour maintenir l'alignement
      syncIntervalId = window.setInterval(() => {
        if (!started) return;
        resyncAllVideos();
      }, 100);
    };

    const startAllVideos = () => {
      if (started) return;

      started = true;

      videos.forEach((video) => {
        try {
          // Toujours repartir de 0 pour assurer une synchro parfaite
          video.currentTime = 0;

          const playPromise = video.play();

          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {
              // Silence les erreurs d'autoplay bloqué par le navigateur
            });
          }
        } catch {
          // Ignore toute erreur individuelle pour ne pas bloquer les autres vidéos
        }
      });

      // Démarrer la boucle de synchronisation continue
      startSyncLoop();
    };

    const tryStartWhenReady = () => {
      if (readyCount >= videos.length) {
        startAllVideos();
      }
    };

    // Gérer la boucle : quand une vidéo arrive à la fin, toutes repartent ensemble
    const handleVideoEnd = () => {
      if (!started) return;

      // Si une vidéo arrive à la fin, on resynchronise toutes les vidéos à 0
      videos.forEach((v) => {
        try {
          v.currentTime = 0;
        } catch {
          // Ignore les erreurs
        }
      });
    };

    videos.forEach((video) => {
      // On met toutes les vidéos en pause et au début avant la synchro
      video.pause();
      video.currentTime = 0;

      // Écouter l'événement 'ended' pour gérer la boucle
      const onEnded = () => {
        handleVideoEnd();
      };

      // Écouter 'timeupdate' pour détecter quand on arrive près de la fin
      const onTimeUpdate = () => {
        if (!started) return;

        // Si on arrive à la fin (à 0.1 seconde près), on resynchronise
        if (video.duration && video.currentTime >= video.duration - 0.1) {
          handleVideoEnd();
        }
      };

      video.addEventListener('ended', onEnded);
      video.addEventListener('timeupdate', onTimeUpdate);

      // Stocker les listeners pour le nettoyage
      videoEventListeners.push(
        { video, event: 'ended', handler: onEnded },
        { video, event: 'timeupdate', handler: onTimeUpdate }
      );

      // Si la vidéo est déjà prête, on incrémente directement
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        readyCount += 1;
        tryStartWhenReady();
        return;
      }

      const onCanPlay = () => {
        video.removeEventListener('canplaythrough', onCanPlay);
        video.removeEventListener('loadeddata', onCanPlay);

        // Retirer de la liste des listeners
        const index = videoEventListeners.findIndex(
          (listener) => listener.video === video && listener.handler === onCanPlay
        );
        if (index > -1) {
          videoEventListeners.splice(index, 1);
        }

        readyCount += 1;
        tryStartWhenReady();
      };

      video.addEventListener('canplaythrough', onCanPlay);
      video.addEventListener('loadeddata', onCanPlay);

      // Stocker les listeners pour le nettoyage
      videoEventListeners.push(
        { video, event: 'canplaythrough', handler: onCanPlay },
        { video, event: 'loadeddata', handler: onCanPlay }
      );
    });

    // Sécurité : même si une vidéo ne se charge jamais, on lance tout après un délai
    const timeoutId = window.setTimeout(() => {
      if (!started) {
        startAllVideos();
      }
    }, maxWaitMs);

    videoSynchroTimeouts.push(timeoutId);

    // Fonction de nettoyage pour ce wrapper
    const cleanup = () => {
      // Arrêter l'intervalle de synchronisation
      if (syncIntervalId !== null) {
        window.clearInterval(syncIntervalId);
        syncIntervalId = null;
      }

      // Retirer tous les event listeners
      videoEventListeners.forEach(({ video, event, handler }) => {
        video.removeEventListener(event, handler);
      });
      videoEventListeners.length = 0;

      // Mettre en pause toutes les vidéos
      videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
    };

    videoSynchroCleanups.push(cleanup);
  };

  // Initialiser chaque wrapper indépendamment
  wrappers.forEach(initWrapperVideos);
};
