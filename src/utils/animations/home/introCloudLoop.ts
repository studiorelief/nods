import gsap from 'gsap';

// Configuration pour chaque nuage
const cloudConfigs = [
  {
    wrapperClass: 'is-1',
    cloudClass: 'home_intro_cloud-1',
    duration: 10, // Durée en secondes - modifiable
  },
  {
    wrapperClass: 'is-2',
    cloudClass: 'home_intro_cloud-2',
    duration: 15, // Durée en secondes - modifiable
  },
  {
    wrapperClass: 'is-3',
    cloudClass: 'home_intro_cloud-3',
    duration: 20, // Durée en secondes - modifiable
  },
];

export function initCloudLoop() {
  cloudConfigs.forEach((config) => {
    const wrapper = document.querySelector(
      `.home_intro_cloud-decorative-loop-w.${config.wrapperClass}`
    ) as HTMLElement;

    if (!wrapper) return;

    const cloud = wrapper.querySelector(`.${config.cloudClass}`) as HTMLElement;
    if (!cloud) return;

    // Positionner le cloud en bas de la section pour commencer
    gsap.set(cloud, { position: 'absolute', bottom: '0%' });

    // Dupliquer le cloud et le positionner en dessous du premier
    const clone = cloud.cloneNode(true) as HTMLElement;
    gsap.set(clone, { position: 'absolute', bottom: '100%' });
    wrapper.appendChild(clone);

    // Animer le wrapper vers le haut
    gsap.to(wrapper, {
      y: '-100%',
      duration: config.duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        y: (y) => {
          const yValue = parseFloat(y);
          // Wrap de 100% à 0%
          return `${yValue % 100}%`;
        },
      },
      onRepeat: () => {
        // Fade in de 2s à chaque répétition de la boucle
        gsap.fromTo(
          wrapper,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2,
            ease: 'none',
          }
        );
      },
    });
  });
}
