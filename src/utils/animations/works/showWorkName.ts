export const initShowWorkName = (): void => {
  const showWorkNameBtn = document.querySelector('#show-work-name');
  const worksCardsHovers = document.querySelectorAll('.works_cards .works_cards-hover');
  const showNameOpen = document.querySelector('.show-name_open');
  const showNameClose = document.querySelector('.show-name_close');

  if (!showWorkNameBtn || worksCardsHovers.length === 0) return;
  if (!showNameOpen || !showNameClose) return;

  let isVisible = false;

  // Initial state
  (showNameOpen as HTMLElement).style.display = 'flex';
  (showNameClose as HTMLElement).style.display = 'none';

  const handleClick = () => {
    // Vérifier si on est sur mobile (< 991px)
    if (window.innerWidth >= 991) return;

    isVisible = !isVisible;

    // Toggle works cards hover
    worksCardsHovers.forEach((hover) => {
      (hover as HTMLElement).style.opacity = isVisible ? '1' : '0';
    });

    // Toggle show-name icons
    if (isVisible) {
      (showNameOpen as HTMLElement).style.display = 'none';
      (showNameClose as HTMLElement).style.display = 'flex';
    } else {
      (showNameOpen as HTMLElement).style.display = 'flex';
      (showNameClose as HTMLElement).style.display = 'none';
    }
  };

  showWorkNameBtn.addEventListener('click', handleClick);
};
