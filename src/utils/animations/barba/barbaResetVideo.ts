// Reset videos
export function resetVideos() {
  const videos = document.querySelectorAll('video');
  if (videos && videos.length > 0) {
    videos.forEach((v) => {
      try {
        // Play only if there is at least one valid source
        const hasSource =
          (v.currentSrc && v.currentSrc.length > 0) ||
          Array.from(v.querySelectorAll('source')).some((s) => !!s.src);
        if (hasSource) {
          const playPromise = v.play();
          if (playPromise && typeof (playPromise as Promise<void>).catch === 'function') {
            (playPromise as Promise<void>).catch(() => {});
          }
        }
      } catch {
        // ignore NotSupportedError
      }
    });
  }
}
