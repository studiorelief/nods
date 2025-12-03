# Guide d'intégration du Preloader

## Vue d'ensemble

Le preloader a été configuré avec les fonctionnalités suivantes :

1. ✅ **Affichage uniquement à la première visite** - Cache pendant 1 semaine
2. ✅ **Compteur de progression** - Affiche le % de chargement des ressources
3. ✅ **Effet de suivi de souris** - `.prealoader_cards` suit le mouvement de la souris
4. ✅ **Animation de sortie fluide** - Disparaît élégamment une fois le chargement terminé

## Structure HTML à ajouter

Ajoutez cette structure HTML dans votre fichier HTML principal (probablement dans Webflow) :

```html
<div class="preloader_component">
  <div class="prealoader_cards">
    <!-- Vous pouvez ajouter votre logo ou autre contenu ici -->
    <div class="prealoader_cards-logo">
      <!-- Votre logo si nécessaire -->
    </div>

    <!-- Compteur de chargement (obligatoire) -->
    <div class="prealoader_cards-loading-count">0%</div>

    <!-- Texte optionnel -->
    <div class="prealoader_cards-text">Chargement en cours...</div>
  </div>
</div>
```

### ⚠️ Important : Éviter le flash du preloader

Pour éviter un flash du preloader lors des visites suivantes, **assurez-vous que** :

1. **Dans Webflow** : Le `.preloader_component` doit avoir `display: none` par défaut (c'est déjà le cas dans le CSS fourni)

2. **Si vous voyez toujours un flash**, ajoutez ce script inline **juste après** le preloader dans votre HTML :

```html
<div class="preloader_component">
  <!-- ... contenu du preloader ... -->
</div>

<script>
  // Cache immédiatement le preloader si ce n'est pas la première visite
  (function () {
    var CACHE_KEY = 'nods_first_visit';
    var CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
    var cachedVisit = localStorage.getItem(CACHE_KEY);

    if (cachedVisit) {
      try {
        var visitData = JSON.parse(cachedVisit);
        var now = Date.now();
        if (now - visitData.timestamp < CACHE_DURATION) {
          // Pas la première visite, cacher immédiatement
          var preloader = document.querySelector('.preloader_component');
          if (preloader) preloader.style.display = 'none';
        }
      } catch (e) {}
    }
  })();
</script>
```

Ce script s'exécute immédiatement et cache le preloader avant même que le CSS ne soit chargé.

## Classes CSS requises

Les classes suivantes sont **obligatoires** pour le bon fonctionnement :

- `.preloader_component` - Container principal du preloader
- `.prealoader_cards` - Container des éléments animés (suivi de souris)
- `.prealoader_cards-loading-count` - Élément qui affichera le pourcentage (0% → 100%)

## Personnalisation CSS

Vous pouvez personnaliser l'apparence dans Webflow ou en modifiant le fichier `src/utils/global/preloader.css` :

### Couleur de fond

```css
.preloader_component {
  background: #000; /* Changez selon votre design */
}
```

### Style du compteur

```css
.prealoader_cards-loading-count {
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  /* Personnalisez selon vos besoins */
}
```

### Intensité du suivi de souris

Dans le fichier `src/utils/global/preloader.ts`, modifiez ces valeurs :

```typescript
// Ligne ~70
mouseX = (e.clientX - window.innerWidth / 2) * 0.03; // ← Ajustez ce multiplicateur (0.03)
mouseY = (e.clientY - window.innerHeight / 2) * 0.03; // ← Plus petit = mouvement plus subtil
```

```typescript
// Ligne ~77
currentX = lerp(currentX, mouseX, 0.1); // ← Ajustez le facteur de lissage (0.1)
// Plus petit = mouvement plus fluide mais plus lent
```

## Gestion du cache

### Durée du cache (actuellement 1 semaine)

Modifiez dans `src/utils/global/preloader.ts` :

```typescript
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semaine
// Exemple pour 1 jour : 1 * 24 * 60 * 60 * 1000
// Exemple pour 1 heure : 60 * 60 * 1000
```

### Forcer l'affichage du preloader (pour tester)

Ouvrez la console du navigateur et tapez :

```javascript
localStorage.removeItem('nods_first_visit');
location.reload();
```

## Animation de sortie

L'animation de sortie est inspirée de votre transition Barba existante. Pour la personnaliser, modifiez la fonction `animatePreloaderOut` dans `src/utils/global/preloader.ts` :

```typescript
const animatePreloaderOut = (preloaderElement: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        preloaderElement.style.display = 'none';
        resolve();
      },
    });

    // Personnalisez la durée et l'easing ici
    tl.to(preloaderElement, {
      opacity: 0,
      duration: 0.8, // ← Durée en secondes
      ease: 'power2.inOut', // ← Type d'easing GSAP
    });
  });
};
```

## Intégration dans Webflow

1. **Créez un nouveau composant dans Webflow** avec la classe `.preloader_component`
2. **Ajoutez les éléments enfants** selon la structure HTML ci-dessus
3. **Positionnez-le en fixed** avec `z-index: 9999` (déjà dans le CSS)
4. **Assurez-vous** que le composant est au niveau racine de votre page

## Débogage

### Le preloader ne s'affiche pas

- Vérifiez que les classes CSS correspondent exactement (attention aux fautes de frappe)
- Ouvrez la console et vérifiez s'il y a des erreurs
- Vérifiez que `localStorage.getItem('nods_first_visit')` retourne `null` (première visite)

### Le compteur ne s'anime pas

- Vérifiez que la classe `.prealoader_cards-loading-count` est correcte
- Ouvrez la console pour voir les warnings/errors

### Le suivi de souris ne fonctionne pas

- Vérifiez que la classe `.prealoader_cards` existe
- Essayez d'ajuster les multiplicateurs dans le code (voir section Personnalisation)

## Support

Les fichiers modifiés/créés :

- ✅ `src/utils/global/preloader.ts` - Logique du preloader
- ✅ `src/utils/global/preloader.css` - Styles du preloader
- ✅ `src/index.ts` - Import et initialisation
- ✅ `src/index.css` - Import du CSS

Le preloader est maintenant intégré et prêt à fonctionner ! 🎉


