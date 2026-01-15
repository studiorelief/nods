export const initVideoSynchro = (): void => {
  const wrappers = document.querySelectorAll('.loop-word_dragon-wrapper');

  if (wrappers.length === 0) return;

  const maxWaitMs = 5000;

  const initWrapperVideos = (wrapper: Element) => {
    const videos = Array.from(wrapper.querySelectorAll('video')) as HTMLVideoElement[];

    if (videos.length === 0) return;

    let readyCount = 0;
    let started = false;

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
    };

    const tryStartWhenReady = () => {
      if (readyCount >= videos.length) {
        startAllVideos();
      }
    };

    videos.forEach((video) => {
      // On met toutes les vidéos en pause et au début avant la synchro
      video.pause();
      video.currentTime = 0;

      // Si la vidéo est déjà prête, on incrémente directement
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        readyCount += 1;
        tryStartWhenReady();
        return;
      }

      const onCanPlay = () => {
        video.removeEventListener('canplaythrough', onCanPlay);
        video.removeEventListener('loadeddata', onCanPlay);

        readyCount += 1;
        tryStartWhenReady();
      };

      video.addEventListener('canplaythrough', onCanPlay);
      video.addEventListener('loadeddata', onCanPlay);
    });

    // Sécurité : même si une vidéo ne se charge jamais, on lance tout après un délai
    window.setTimeout(() => {
      if (!started) {
        startAllVideos();
      }
    }, maxWaitMs);
  };

  // Initialiser chaque wrapper indépendamment
  wrappers.forEach(initWrapperVideos);
};
