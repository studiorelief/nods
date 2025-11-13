/**
 * Initialize animation for #intro-glb element following mouse movement
 * Creates a smooth parallax effect based on mouse position
 */
export function initAnimGLB(): (() => void) | undefined {
  const introGlb = document.querySelector<HTMLDivElement>('#intro-glb');

  if (!introGlb) {
    console.error('Element #intro-glb not found');
    return;
  }

  // Animation parameters
  const moveIntensity = 20; // Maximum pixels to move
  const smoothness = 0.1; // Animation smoothness (lower = smoother)

  // Current position
  let currentX = 0;
  let currentY = 0;

  // Target position based on mouse
  let targetX = 0;
  let targetY = 0;

  /**
   * Handle mouse move event
   */
  const handleMouseMove = (e: MouseEvent): void => {
    // Calculate mouse position relative to viewport center (-1 to 1)
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Set target position
    targetX = mouseX * moveIntensity;
    targetY = mouseY * moveIntensity;
  };

  /**
   * Animate with smooth interpolation
   */
  const animate = (): void => {
    // Smoothly interpolate current position towards target
    currentX += (targetX - currentX) * smoothness;
    currentY += (targetY - currentY) * smoothness;

    // Apply transform
    introGlb.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Continue animation
    requestAnimationFrame(animate);
  };

  // Start listening to mouse movements
  window.addEventListener('mousemove', handleMouseMove);

  // Start animation loop
  animate();

  // Return cleanup function (optional, for frameworks like React/Vue)
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}

export function resetGlbPosition() {
  const modelViewers = document.querySelectorAll('#intro-glb') as NodeListOf<
    HTMLElement & {
      cameraOrbit: string;
      returnToInitialPosition: number;
    }
  >;

  if (modelViewers.length === 0) return;

  const initialOrbit = '0deg 90deg 6m';
  const maxRotationDeg = 10; // Maximum rotation allowed on X & Y axes
  const userInteracting = new WeakMap<HTMLElement, boolean>();

  modelViewers.forEach((modelViewer) => {
    // Set min and max camera orbit to limit rotation to ±10 degrees
    // Format: "theta phi radius" where theta is horizontal, phi is vertical
    modelViewer.setAttribute(
      'min-camera-orbit',
      `-${maxRotationDeg}deg ${90 - maxRotationDeg}deg auto`
    );
    modelViewer.setAttribute(
      'max-camera-orbit',
      `${maxRotationDeg}deg ${90 + maxRotationDeg}deg auto`
    );

    userInteracting.set(modelViewer, false);

    modelViewer.addEventListener('camera-change', () => {
      userInteracting.set(modelViewer, true);
      clearTimeout(modelViewer.returnToInitialPosition);
      modelViewer.returnToInitialPosition = window.setTimeout(() => {
        userInteracting.set(modelViewer, false);
        modelViewer.cameraOrbit = initialOrbit;
      }, 50);
    });

    const resetCameraOrbit = () => {
      if (!userInteracting.get(modelViewer)) {
        modelViewer.cameraOrbit = initialOrbit;
      }
    };

    modelViewer.addEventListener('mouseup', resetCameraOrbit);
    modelViewer.addEventListener('touchend', resetCameraOrbit);
  });
}
