Kraland CSS theme — prototype

Objectif
- Moderniser l'UI de http://www.kraland.org côté client (CSS/JS) sans accès serveur.
- Thème couleur: palette "rouge / style URSS" adaptée à l'univers roleplay.
- Priorités: lisibilité, accessibilité, responsive, compatibilité Bootstrap 3.3.7.

Contenu
- `kraland-theme.css` — fichier principal (variables + overrides)
- `playwright-inject.js` — script Playwright pour injecter le CSS et capturer screenshots
- `kraland-userscript.user.js` — Tampermonkey userscript pour usage personnel

Usage rapide
- Pour prototyper localement: `node playwright-inject.js` (installez Playwright si besoin)
- Pour usage persistant: importer `kraland-userscript.user.js` dans Tampermonkey/Greasemonkey

Notes
- Vérifier CSP et tester pages internes; ajuster sélecteurs si le site évolue.

Features
- Floating toggler + variant switcher ("URSS red" and "High-contrast") — persisted in `localStorage` under `kr-theme-variant`.
- Auto-reapply on DOM changes and SPA navigations; CSS fetched from `http://localhost:4848/workspace/kraland-css/kraland-theme.css` and cached in `localStorage` for offline resilience.
- Bitmap icons are approximated via CSS filters; replace with SVG for pixel-perfect recolor if needed.