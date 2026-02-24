# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Langue

Tout échange, commentaire et documentation doit être rédigé **en français**.

## Présentation du projet

Userscript Tampermonkey qui modernise l'interface de http://www.kraland.org côté client via du CSS de surcharge et du JS vanilla. Le site utilise Bootstrap 3. Le userscript ne peut pas modifier le HTML/CSS original du site, uniquement le surcharger.

9 variantes de thème basées sur les nations de Kraland, pilotées par des variables CSS (`--kr-primary`, `--kr-highlight`, etc.) et une classe sur `<html>` (ex : `kr-theme-variant-empire-brun`).

## Commandes

```bash
npm run build      # Build (inline CSS dans JS) + validation auto (postbuild)
npm run watch      # Rebuild auto sur changements (nodemon)
npm run serve      # Serveur HTTP local port 4848 avec CORS
npm run lint       # Lint CSS (stylelint) + JS (eslint)
npm run lint:fix   # Auto-fix lint CSS + JS
npm run test:e2e   # Tests Playwright (chromium uniquement)
npm run validate   # Validation userscript seule
```

## Fichiers modifiables vs générés

**Modifier uniquement :**
- `kraland-userscript-template.js` — source JS principale (~8000+ lignes)
- `kraland-theme.css` — CSS de surcharge (~9700+ lignes)

**NE JAMAIS modifier directement :**
- `kraland-userscript-main.user.js` — fichier généré par `build.js`

Après modification, exécuter `npm run build` pour régénérer le fichier principal.

## Architecture JS

Le template JS est une IIFE avec `'use strict'`. L'initialisation est orchestrée par `InitQueue` :

```js
InitQueue.register('nom-module', function() { /* ... */ }, priority);
```

- Les modules s'auto-enregistrent avec un nom, une fonction et une priorité (plus petit = exécuté en premier, défaut 100)
- `InitQueue.run()` est appelé une fois au `DOMContentLoaded`
- Chaque module décide lui-même s'il s'exécute selon le contexte (mobile/desktop/page)
- `isMobileMode()` détecte le mobile via la classe `body.mobile-mode`

## Build system

`build.js` (Node.js ESM) :
1. Lit `kraland-theme.css` et `kraland-userscript-template.js`
2. Échappe le CSS et remplace le placeholder `'__CSS_CONTENT__'` dans le template
3. Génère un header userscript avec version timestampée (`1.0.<timestamp>`)
4. Remplace les placeholders `__USERSCRIPT_VERSION__` et URL du changelog
5. Écrit `kraland-userscript-main.user.js` et met à jour `kraland-userscript.user.js`
6. Les URLs sont adaptées selon la branche git : `main` → GitHub raw, autre → `localhost:4848`

## Conventions CSS

- **Mobile** : `@media (max-width: 767px) { ... }` — ne jamais utiliser `min-width` pour le mobile
- **Desktop** : `@media (min-width: 768px) { ... }` — ne jamais utiliser `max-width` pour le desktop
- Les styles mobile et desktop doivent toujours être dans leur media query respective, jamais en global
- Variables de thème sur `:root` et surcharges via classes `html.kr-theme-variant-*`

## Conventions JS

- Single quotes, 2 espaces d'indentation, semicolons obligatoires, pas de trailing comma
- `sourceType: 'script'` (pas de modules ES6 dans le template)
- `ecmaVersion: 2022`
- Strict equality (`eqeqeq`), accolades obligatoires (`curly`)
- Utiliser `GM.*` (pas `GM_*` qui est déprécié)

## Workflow de test avec Playwright

1. Modifier les fichiers sources
2. `npm run build`
3. Attendre 5 secondes pour la synchronisation Tampermonkey
4. Tester via Playwright MCP tools (viewport mobile : 375x667, desktop : 1280x720)
5. Vérifier l'absence d'impact croisé mobile/desktop
