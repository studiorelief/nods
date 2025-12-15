import gsap from 'gsap';

export const initServicesParallax = (): void => {
  const getCardIndex = (el: HTMLElement): number => {
    const className = Array.from(el.classList).find((c) => c.startsWith('home_services_card-'));
    if (!className) return Number.POSITIVE_INFINITY;
    const match = className.match(/home_services_card-(\d+)/);
    return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
  };

  // Target all cards inside the services component (home_services_card-1 ... home_services_card-N)
  const cards = gsap.utils.toArray<HTMLElement>(
    '.home_services_component [class^="home_services_card-"]'
  );

  if (cards.length === 0) return;

  const sortedCards = [...cards].sort((a, b) => getCardIndex(a) - getCardIndex(b));

  sortedCards.forEach((card, idx) => {
    const cardIndex = getCardIndex(card);
    const startY = idx === 0 ? '100% 100%' : '95% 100%';

    // Card wrapper parallax (vertical translate)
    gsap.fromTo(
      card,
      { y: '0rem' },
      {
        y: '-50rem',
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          markers: false,
          trigger: card,
          start: startY,
          end: '200% 00%',
          scrub: true,
        },
      }
    );

    // Inner card scale (match ids from Webflow: #first-card, #services-card-N)
    const innerSelector = cardIndex === 1 ? '#first-card' : `#services-card-${cardIndex}`;
    const cardInner =
      card.querySelector<HTMLElement>(innerSelector) ||
      card.querySelector<HTMLElement>('.home_services_cards');

    if (!cardInner) return;

    gsap.fromTo(
      cardInner,
      { scale: 1 },
      {
        scale: 0.75,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          markers: false,
          trigger: card,
          start: '100% 75%',
          end: '200% 00%',
          scrub: true,
        },
      }
    );
  });
};
