# Script de Reset des Animations GSAP Natives de Webflow

Ce script résout le problème des animations GSAP natives de Webflow qui ne fonctionnent pas correctement avec Barba.js depuis l'acquisition de GSAP par Webflow.

## Problème

Depuis que Webflow a acquis GSAP, les animations GSAP natives ne sont pas réinitialisées après les transitions de page avec Barba.js, ce qui cause :

- Des animations qui ne se déclenchent pas
- Des états d'animation corrompus
- Des conflits entre animations natives et personnalisées

## Solution

Le script `webflowGsapReset.ts` fournit une solution complète qui :

1. **Détecte automatiquement** les animations GSAP natives de Webflow
2. **Réinitialise les propriétés CSS** des éléments animés
3. **Nettoie les attributs data-w-id** spécifiques à Webflow
4. **Force la réinitialisation** de l'instance Webflow
5. **S'intègre parfaitement** avec Barba.js

## Utilisation

### Intégration automatique

Le script est déjà intégré dans `src/index.ts` et s'exécute automatiquement :

- **Au chargement initial** de la page
- **Après chaque navigation Barba** (hook `afterEnter`)

### Utilisation manuelle

```typescript
import { resetWebflowGsapAnimations } from '$utils/animations/webflowGsapReset';

// Reset simple
const cleanup = resetWebflowGsapAnimations();

// Reset avec options
const cleanup = resetWebflowGsapAnimations({
  rootSelector: '.my-container', // Limiter le scope
  resetCustomGsap: true, // Reset aussi les animations GSAP personnalisées
  forceReset: false, // Forcer le reset même si pas d'animations détectées
  onComplete: () => {
    console.log('Reset terminé!');
  },
});

// Nettoyer si nécessaire
cleanup();
```

### Fonctions utilitaires

```typescript
import { isWebflowGsapActive, getWebflowGsapResetStatus } from '$utils/animations/webflowGsapReset';

// Vérifier si Webflow GSAP est actif
const isActive = isWebflowGsapActive();

// Vérifier le statut du reset
const isReset = getWebflowGsapResetStatus();
```

## Test

Un script de test est disponible dans `test-webflow-gsap-reset.js` :

```javascript
// Dans la console du navigateur
testWebflowGsapReset.debug(); // Affiche toutes les informations
testWebflowGsapReset.testDetection(); // Teste la détection
testWebflowGsapReset.testReset(); // Teste le reset
testWebflowGsapReset.testStatus(); // Teste le statut
```

## Configuration

### Options disponibles

- `rootSelector`: Sélecteur racine pour limiter le scope (défaut: `'body'`)
- `forceReset`: Force le reset même si pas d'animations détectées (défaut: `false`)
- `onComplete`: Callback appelé après le reset
- `resetCustomGsap`: Reset aussi les animations GSAP personnalisées (défaut: `false`)

### Détection automatique

Le script détecte automatiquement les animations Webflow GSAP via :

- Présence de `window.Webflow`
- Éléments avec `data-w-id`
- Éléments avec classe `w-animate`
- Éléments avec `data-animation`

## Compatibilité

- ✅ Barba.js 2.x
- ✅ GSAP 3.x
- ✅ Webflow avec animations GSAP natives
- ✅ TypeScript
- ✅ ES6+

## Notes importantes

1. **Performance** : Le script utilise `requestAnimationFrame` pour éviter les conflits de timing
2. **Sécurité** : Vérifie l'existence des éléments avant manipulation
3. **Flexibilité** : Peut être utilisé sur des conteneurs spécifiques
4. **Debug** : Fournit des fonctions utilitaires pour le debugging

## Exemple d'utilisation avec Barba

```typescript
barba.hooks.afterEnter(() => {
  // Reset des animations Webflow GSAP après navigation
  resetWebflowGsapAnimations({
    resetCustomGsap: true,
    onComplete: () => {
      // Réinitialiser les autres animations personnalisées
      initCustomAnimations();
    },
  });
});
```
