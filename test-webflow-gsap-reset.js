/**
 * Script de test pour vérifier le fonctionnement du reset des animations GSAP natives de Webflow
 * 
 * Ce script peut être utilisé dans la console du navigateur pour tester les fonctions
 * de reset des animations Webflow GSAP.
 */

// Fonctions de test disponibles dans la console
(window as any).testWebflowGsapReset = {
  /**
   * Teste la détection des animations Webflow GSAP
   */
  testDetection: () => {
    const hasWebflowGsap = !!(
      (window as any).Webflow ||
      document.querySelector('[data-w-id]') ||
      document.querySelector('.w-animate') ||
      document.querySelector('[data-animation]')
    );
    
    console.log('Webflow GSAP détecté:', hasWebflowGsap);
    console.log('Éléments avec data-w-id:', document.querySelectorAll('[data-w-id]').length);
    console.log('Éléments avec classe w-animate:', document.querySelectorAll('.w-animate').length);
    console.log('Éléments avec data-animation:', document.querySelectorAll('[data-animation]').length);
    
    return hasWebflowGsap;
  },

  /**
   * Teste le reset des animations Webflow GSAP
   */
  testReset: () => {
    console.log('Test du reset des animations Webflow GSAP...');
    
    // Simuler l'import de la fonction (en réalité, elle sera déjà importée)
    const { resetWebflowGsapAnimations } = require('./src/utils/animations/webflowGsapReset');
    
    const cleanup = resetWebflowGsapAnimations({
      resetCustomGsap: true,
      onComplete: () => {
        console.log('Reset terminé avec succès!');
      }
    });
    
    return cleanup;
  },

  /**
   * Teste le statut du reset
   */
  testStatus: () => {
    const root = document.querySelector('body') as HTMLElement;
    const status = root?.dataset.webflowGsapReset === 'true';
    console.log('Statut du reset:', status);
    return status;
  },

  /**
   * Affiche toutes les informations de debug
   */
  debug: () => {
    console.log('=== DEBUG WEBFLOW GSAP RESET ===');
    console.log('1. Détection:', testWebflowGsapReset.testDetection());
    console.log('2. Statut:', testWebflowGsapReset.testStatus());
    console.log('3. Instance Webflow:', !!(window as any).Webflow);
    console.log('4. Instance GSAP:', !!(window as any).gsap);
    console.log('===============================');
  }
};

console.log('Script de test Webflow GSAP Reset chargé!');
console.log('Utilisez testWebflowGsapReset.debug() pour voir toutes les informations');
