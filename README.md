# Kraland CSS Theme - USSR Red

Thème CSS moderne pour [Kraland Interactif](http://www.kraland.org) avec palette rouge inspirée de l'URSS.

## 🎯 Objectif

Moderniser l'interface de Kraland côté client (CSS/JS uniquement) sans accès serveur :
- **Thème** : Palette rouge/or style URSS adaptée à l'univers roleplay
- **Priorités** : Lisibilité, accessibilité, responsive
- **Compatibilité** : Bootstrap 3.3.7 (surcharge propre sans casser le site)

## ✨ Optimisations CSS (v2.0)

Le CSS a été entièrement refactorisé pour suivre les meilleures pratiques :

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Déclarations `!important` | 84 | **19** | **-77%** |
| Sélecteurs dupliqués | 6+ | 0 | -100% |
| Media queries | 3 blocs | 2 blocs | -33% |
| Variables CSS inutilisées | 1 | 0 | -100% |

**Stratégie** : Utilisation de la **spécificité CSS** (sélecteurs composés) au lieu de forcer avec `!important`.

## 📁 Structure du projet

```
kraland-css/
├── kraland-theme.css              # CSS principal optimisé
├── kraland-userscript.user.js     # Version DEV (fetch localhost)
├── kraland-userscript-main.js     # Version PROD (CSS bundlé)
├── kraland-userscript-template.js # Template pour build
├── build.js                       # Script de génération
├── package.json                   # Dependencies Node.js
└── start-server.ps1               # Serveur local (Windows)
```

## 🚀 Installation

### Option A : Mode DEV (développement avec hot-reload)

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur local** :
   ```bash
   # Node.js
   npx http-server -p 4848

   # PowerShell (Windows)
   .\start-server.ps1 -Port 4848
   ```

3. **Installer le userscript** :
   - Installer [Tampermonkey](https://www.tampermonkey.net/) dans votre navigateur
   - Ouvrir `kraland-userscript.user.js` et l'importer dans Tampermonkey
   - Le CSS sera chargé automatiquement depuis `http://localhost:4848/kraland-theme.css`
   - ✅ **Rechargement automatique** toutes les 60 secondes

### Option B : Mode PROD (version standalone)

1. **Générer le bundle** :
   ```bash
   node build.js
   ```
   Cela crée `kraland-userscript-main.js` avec le CSS inclus inline.

2. **Installer le bundle** :
   - Importer `kraland-userscript-main.js` dans Tampermonkey
   - Aucun serveur local nécessaire

## 🎨 Fonctionnalités

### Interface
- **Toggler flottant** : Activer/désactiver le thème (en bas à droite)
- **Sélecteur de variante** :
  - `URSS red` (par défaut)
  - `High-contrast` (contraste élevé)
- Persistance dans `localStorage`

### Technique
- **Auto-réapplication** en cas de suppression du style
- **Support SPA** : Détection des navigations (pushState, popstate)
- **Cache résilient** : Stockage du CSS en `localStorage`
- **MutationObserver** : Surveillance des modifications DOM

## 🛠️ Développement

### Modifier le CSS

1. Éditer `kraland-theme.css`
2. Si en **mode DEV** : Le CSS sera rechargé automatiquement dans les 60s
3. Si en **mode PROD** : Relancer `node build.js`

### Architecture CSS

Le fichier est organisé en **13 sections** :

```css
/* 1. CSS Variables (--kr-primary, --kr-highlight, etc.) */
/* 2. Layout Overrides (11 !important critiques) */
/* 3. Typography & Utilities */
/* 4. Navigation */
/* 5. Buttons */
/* 6. Forms */
/* 7. Panels & Cards */
/* 8. Badges, Labels & Alerts */
/* 9. List Groups */
/* 10. Carousel */
/* 11. Links */
/* 12. Icons */
/* 13. Responsive (media queries) */
```

### Bonnes pratiques appliquées

✅ **Sélecteurs composés** pour matcher Bootstrap :
```css
/* ❌ Mauvais (trop faible) */
.btn-primary { color: red !important; }

/* ✅ Bon (spécificité suffisante) */
.btn.btn-primary,
.btn-primary.btn { color: red; }
```

✅ **Variables CSS** pour faciliter les variants :
```css
:root { --kr-primary: #a6120d; }

```

✅ **Media queries consolidés** (pas de duplication)

## 📝 Notes

- Le site utilise Bootstrap 3.3.7 + Font Awesome 5.6.3
- Vérifier la CSP si hébergement externe
- Icônes bitmap approximées via CSS filters (préférer SVG si besoin)

## 📄 Licence

Usage personnel pour [Kraland Interactif](http://www.kraland.org)
