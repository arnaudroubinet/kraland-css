# Thème Kraland - UserScript Tampermonkey

Extension CSS/JavaScript pour moderniser l'interface de [Kraland Interactif](http://www.kraland.org) côté client.

## Installation

### Prérequis

1. Installer l'extension [Tampermonkey](https://www.tampermonkey.net/) dans votre navigateur :
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)

### Installation du script

1. Télécharger le fichier [kraland-userscript-main.js](kraland-userscript-main.js)

2. Ouvrir Tampermonkey dans votre navigateur (cliquer sur l'icône dans la barre d'outils)

3. Cliquer sur "Créer un nouveau script" ou "Tableau de bord"

4. Dans le tableau de bord, cliquer sur l'onglet "Utilitaires" puis "Importer depuis un fichier"

   **OU** copier-coller le contenu du fichier `kraland-userscript-main.js` directement dans l'éditeur

5. Sauvegarder (Ctrl+S ou Fichier > Enregistrer)

6. Le script s'activera automatiquement sur `www.kraland.org`

### Mise à jour automatique

#### Installation depuis une URL (recommandé)

Si le script est hébergé en ligne (GitHub, Gist, etc.), vous pouvez l'installer directement depuis l'URL :

1. Copier l'URL du fichier raw (exemple : `https://raw.githubusercontent.com/username/repo/main/kraland-userscript-main.js`)

2. Dans Tampermonkey : **Utilitaires** > **Installer depuis une URL**

3. Coller l'URL et cliquer sur **Installer**

4. Tampermonkey vérifiera automatiquement les mises à jour selon l'intervalle configuré

#### Configurer l'intervalle de vérification

1. Ouvrir **Tampermonkey** > **Tableau de bord**

2. Aller dans l'onglet **Paramètres** (icône d'engrenage)

3. Trouver la section **"Mise à jour des scripts"** :
   - **Vérifier les mises à jour** : ✓ Activer
   - **Intervalle de vérification** : Sélectionner **"Tous les 2 jours"** (48h)
   - **Mettre à jour automatiquement** : ✓ Activer (installe automatiquement les nouvelles versions)

4. Sauvegarder

Tampermonkey vérifiera désormais toutes les 48h si une nouvelle version est disponible et l'installera automatiquement.

#### Forcer une vérification manuelle

À tout moment, vous pouvez forcer la vérification :
- Clic droit sur l'icône Tampermonkey > **"Rechercher les mises à jour des scripts utilisateur"**

## Configuration du thème

### Accès à l'interface de configuration

1. Connectez-vous sur [www.kraland.org](http://www.kraland.org)

2. Naviguez vers **Profil > Interface** (`/profil/interface`)

3. Descendez jusqu'à la section **"Thème de base"** du site officiel

4. Juste au-dessus, vous trouverez une nouvelle section **"Thème Tampermonkey"** avec un formulaire de sélection

### Choix disponibles

Le script propose **9 variantes de thème** basées sur les différentes nations de Kraland :

| Thème | Couleur principale | Description |
|-------|-------------------|-------------|
| **République de Kraland** | Rouge (#8b0f0e) | Thème par défaut |
| **Empire Brun** | Brun (#5E3B2D) | Palette marron/or |
| **Paladium Corporation** | Or (#D4AF37) | Palette dorée/verte |
| **Théocratie Seelienne** | Bleu (#0033A0) | Palette bleue |
| **Paradigme Vert** | Vert (#0B6623) | Palette verte foncée |
| **Khanat Elmérien** | Violet (#6A0DAD) | Palette violette |
| **Confédération Libre** | Gris (#6B7280) | Palette neutre |
| **Royaume de Ruthvénie** | Vert/Rouge (#0A6B2D) | Bi-couleur |
| **Désactiver** | - | Retour au thème original |

### Persistance

Les préférences sont sauvegardées automatiquement dans le **localStorage** du navigateur et restent actives entre les sessions.

## Comment ça fonctionne

### Architecture technique

Le userscript `kraland-userscript-main.js` est une version **autonome** qui contient :
1. **CSS inline** : ~1050 lignes de CSS bundlé dans une constante JavaScript
2. **Logique JavaScript** : ~600 lignes de code pour l'injection et la gestion du thème

### 1. Injection du CSS

```javascript
// Le CSS est stocké dans une constante
const BUNDLED_CSS = `/* 1050+ lignes de CSS optimisé */`;

// Au chargement de la page
function applyThemeInline(cssText) {
  let style = document.getElementById('kraland-theme-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'kraland-theme-style';
    document.head.appendChild(style);
  }
  style.textContent = cssText;
}
```

**Points clés** :
- Le CSS est injecté via un élément `<style>` dynamique dans le `<head>`
- L'ID de l'élément est `kraland-theme-style`
- Le CSS utilise des **variables CSS** (`--kr-primary`, `--kr-highlight`, etc.) pour faciliter les variantes

### 2. Système de variantes

Chaque variante modifie simplement quelques variables CSS :

```css
/* Variables par défaut */
:root {
  --kr-primary: #8b0f0e;
  --kr-highlight: #c41e3a;
  --kr-gold: #C69100;
}

/* Variante Empire Brun */
html.kr-theme-variant-empire-brun {
  --kr-primary: #5E3B2D;
  --kr-highlight: #C69100;
}
```

Le script JavaScript ajoute dynamiquement la classe correspondante à l'élément `<html>` :

```javascript
document.documentElement.classList.add('kr-theme-variant-empire-brun');
```

### 3. Améliorations du DOM

Le script ne fait pas que du CSS, il améliore aussi le HTML :

#### a) Remplacement du logo de la navbar

```javascript
function replaceNavbarBrand() {
  const brand = document.querySelector('.navbar-brand');
  const variant = localStorage.getItem('kr-theme-variant') || 'kraland';
  const logoIndex = getLogoIndexForVariant(variant); // 1-8 selon la variante
  const img = document.createElement('img');
  img.src = `http://img7.kraland.org/2/world/logo${logoIndex}.gif`;
  brand.innerHTML = '';
  brand.appendChild(img);
}
```

#### b) Footer sticky

```javascript
function ensureFooterSticky() {
  const footer = document.querySelector('footer');
  // Place le bouton "Remonter" dans le footer
  const backToTop = document.querySelector('a[href="#top"]');
  if (backToTop) footer.appendChild(backToTop);

  // Ajoute du padding au body pour éviter le chevauchement
  document.body.style.paddingBottom = '60px';
}
```

#### c) Relocation des statistiques

```javascript
function relocateKramailToLeft() {
  // Déplace "Membres actifs", "Personnages actifs", "Personnes en ligne"
  // de la colonne droite (#col-t) vers la colonne gauche (#col-left)
  const stats = document.querySelectorAll('.ds_users, .ds_characters, .ds_online');
  const leftColumn = document.getElementById('col-left');
  stats.forEach(stat => leftColumn.appendChild(stat));
}
```

#### d) Amélioration de l'accessibilité

- Remplacement des images `<img>` par des symboles Unicode dans des `<span>` avec `aria-hidden`
- Conversion des images de sexe (♂/♀) en texte stylé
- Ajout de labels ARIA sur les boutons

### 4. Résilience et SPA

Le script surveille les modifications du DOM et les navigations :

```javascript
// MutationObserver pour surveiller la suppression du style
const observer = new MutationObserver(() => {
  if (!document.getElementById('kraland-theme-style')) {
    applyThemeInline(BUNDLED_CSS); // Réinjecter
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

// Intercepter les navigations SPA (pushState/popstate)
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(this, arguments);
  setTimeout(() => ensureTheme(), 250);
};
```

### 5. Interface de configuration

L'interface est insérée dynamiquement sur `/profil/interface` :

```javascript
function insertTampermonkeyThemeUI() {
  // Trouve le titre "Thème de base"
  const heading = Array.from(document.querySelectorAll('h4'))
    .find(h => h.textContent.includes('Thème de base'));

  // Insère un formulaire radio avant cette section
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="radio">
      <label>
        <input type="radio" name="kr-theme" value="kraland">
        République de Kraland
      </label>
    </div>
    <!-- ... autres options ... -->
  `;

  // Écouter les changements
  form.addEventListener('change', (e) => {
    const variant = e.target.value;
    applyThemeVariant(variant);
  });
}
```

## Pour les développeurs de www.kraland.org

### Implémentation native recommandée

Si vous souhaitez intégrer ces changements dans le thème officiel de Kraland, voici les étapes :

#### 1. Ajouter les variables CSS

Dans votre fichier CSS principal, définir les variables :

```css
:root {
  --kr-primary: #8b0f0e;
  --kr-primary-dark: #700b09;
  --kr-gold: #C69100;
  --kr-highlight: #c41e3a;
  --kr-surface: #fff;
  --kr-text: #0f1724;
  --kr-muted: #6b7280;
  --kr-navbar-bg: #111315;
  --kr-radius: .5rem;
}
```

#### 2. Copier le CSS optimisé

Le fichier `kraland-theme.css` contient 13 sections bien organisées :

1. Variables CSS
2. Layout overrides (navbar, footer sticky)
3. Typographie
4. Navigation
5. Boutons
6. Formulaires
7. Panels et cartes
8. Badges et alertes
9. List groups
10. Carousel
11. Liens
12. Icônes
13. Media queries responsive

**Important** : Le CSS utilise la **spécificité** au lieu de `!important` (seulement 19 déclarations `!important` sur 1050 lignes, contre 84 avant optimisation).

#### 3. Ajouter le système de variantes côté serveur

Dans votre backend PHP, permettre aux utilisateurs de choisir une variante dans `/profil/interface` :

```php
// Exemple de traitement
$variant = $_POST['theme_variant'] ?? 'kraland';
$validVariants = ['kraland', 'empire-brun', 'paladium', /*...*/];

if (in_array($variant, $validVariants)) {
    // Sauvegarder en DB
    $user->setThemeVariant($variant);
}
```

Puis injecter la classe dans le HTML :

```php
<html class="kr-theme-enabled kr-theme-variant-<?= htmlspecialchars($user->getThemeVariant()) ?>">
```

#### 4. Implémenter les améliorations DOM

Les fonctions suivantes peuvent être réécrites côté serveur (PHP) :

**Logo de la navbar** :
```php
// Au lieu de faire la substitution en JS, générer directement le bon logo
$logoIndex = getLogoIndexForVariant($user->getThemeVariant());
echo '<img src="http://img7.kraland.org/2/world/logo' . $logoIndex . '.gif" alt="Kraland">';
```

**Footer sticky** :
```html
<!-- Ajouter directement dans le template -->
<body style="padding-bottom: 60px;">
  <footer class="navbar-inverse" style="position: fixed; bottom: 0; width: 100%; z-index: 1030;">
    <!-- Contenu du footer -->
    <a href="#top" class="kraland-back-to-top" aria-label="Remonter en haut">↑</a>
  </footer>
</body>
```

**Statistiques dans la colonne gauche** :
```php
// Dans le template de la sidebar gauche (#col-left)
<div class="kraland-metrics list-group">
  <a href="/membres" class="list-group-item ds_users">Membres actifs</a>
  <a href="/personnages" class="list-group-item ds_characters">Personnages actifs</a>
  <a href="/online" class="list-group-item ds_online">Personnes en ligne</a>
</div>
```

#### 5. Optimisations recommandées

1. **Minifier le CSS** : Le fichier fait ~1050 lignes, une version minifiée économisera de la bande passante

2. **Éviter le JavaScript** : Toutes les modifications DOM peuvent être faites côté serveur, sauf :
   - La détection de navigation SPA (si vous implémentez un vrai SPA)
   - Le rechargement du style si supprimé (pas nécessaire si intégré nativement)

3. **Cache navigateur** : Ajouter des headers de cache agressifs sur le CSS :
   ```
   Cache-Control: public, max-age=31536000
   ```

4. **Variables CSS dynamiques** : Si vous voulez permettre la personnalisation avancée, vous pouvez générer les variables CSS dynamiquement :
   ```php
   <style>
   :root {
     --kr-primary: <?= $user->getCustomPrimaryColor() ?? '#8b0f0e' ?>;
   }
   </style>
   ```

### Structure du projet userscript

Pour information, voici comment le projet est organisé :

```
kraland-css/
├── kraland-theme.css              # CSS source (non bundlé)
├── kraland-userscript-main.js     # Version PROD (CSS inline)
├── kraland-userscript.user.js     # Version DEV (fetch localhost)
├── build.js                       # Script de build
└── README.md                      # Ce fichier
```

Le fichier `build.js` lit `kraland-theme.css` et l'injecte dans `kraland-userscript-main.js` comme constante JavaScript.

## Avantages de cette approche

### Pour les utilisateurs

- **Aucune installation serveur** : Le script fonctionne entièrement côté client
- **Personnalisation instantanée** : Changement de thème en 1 clic
- **Persistant** : Les préférences survivent aux sessions
- **Réversible** : Désactivation en 1 clic

### Pour www.kraland.org

Si implémenté nativement :

1. **Meilleure performance** : Pas de JavaScript pour manipuler le DOM, tout est généré côté serveur
2. **SEO** : Le HTML est correct dès le premier rendu
3. **Accessibilité** : Les améliorations (aria-label, symboles Unicode) sont natives
4. **Maintenabilité** : Un seul thème officiel avec variantes, au lieu de multiples feuilles CSS

## Notes techniques

- Le site utilise **Bootstrap 3.3.7** et **Font Awesome 5.6.3**
- Le CSS exploite la **cascade** et la **spécificité** pour surcharger Bootstrap proprement
- Les `!important` sont réservés aux cas critiques (11 sur 1050 lignes) :
  - Override de styles inline (`style=""`)
  - Override de `!important` existant dans Bootstrap
  - Positionnement fixed du footer

## Support

Ce script est un projet personnel non affilié à Kraland. Pour toute question :

- Ouvrir une issue sur le repository GitHub
- Contacter les modérateurs de Kraland pour demander une intégration officielle

## Licence

Usage personnel pour [Kraland Interactif](http://www.kraland.org).
