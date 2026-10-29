# AGENTS.md

Instructions pour les agents de code (Claude Code, Hermes, Codex…) travaillant dans ce dépôt.

## Langue

Tout échange, commentaire et documentation doit être rédigé **en français**.

## Présentation du projet

Userscript Tampermonkey qui modernise l'interface de http://www.kraland.org côté client via du CSS de surcharge et du JS vanilla. Le site utilise Bootstrap 3. Le userscript ne peut pas modifier le HTML/CSS original du site, uniquement le surcharger.

9 variantes de thème basées sur les nations de Kraland, pilotées par des variables CSS (`--kr-primary`, `--kr-highlight`, etc.) et une classe sur `<html>` (ex : `kr-theme-variant-empire-brun`).

Projet à usage personnel. Kraland est un jeu parodique : pas de ton dramatique.

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
- `kraland-userscript-template.js` — source JS principale (~11000 lignes)
- `kraland-theme.css` — CSS de surcharge (~15000 lignes)

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
- Une garde de page ajoutée à un sélecteur s'écrit `:where(html.x)` (spécificité nulle) ; `html:where(.x)` ajoute (0,0,1)
- Retirer une règle de la peau peut révéler un défaut natif : vérifier le rendu après suppression

## Conventions JS

- Single quotes, 2 espaces d'indentation, semicolons obligatoires, pas de trailing comma
- `sourceType: 'script'` (pas de modules ES6 dans le template)
- `ecmaVersion: 2022`
- Strict equality (`eqeqeq`), accolades obligatoires (`curly`)
- Utiliser `GM.*` (pas `GM_*` qui est déprécié)

## Faits du site Kraland

- HTTP uniquement (pas de HTTPS) : un navigateur réel a besoin de désactiver l'upgrade HTTPS
- `/report` : un seul GET marque toutes les notifications comme lues. Ne jamais le précharger. Exception : si la cloche n'est pas active (aucune notification non lue : ni pastille, ni compteur), un GET sur `/report` est permis, car il n'y a rien à marquer. Vérifier la cloche juste avant l'accès (Arnaud, 2026-10-29)
- Listes de sujets, 3 états d'icône : `i.fa.fa-folder`, `i.fa.fa-folder-open:not(.far)`, `i.far.fa-folder-open`
- Menus de forums : la liste latérale native affichée est la source de vérité (pas de clé par personnage) ; un forum sans accès est retiré
- Pièces du plateau : conserver l'ordre DOM natif. Icônes remplacées : repli sur l'URL d'origine
- Bootstrap 3 sur tactile pose `.dropdown-backdrop` en z-index 990
- Données de jeu (noms, slugs, identifiants) : ne pas anonymiser. Seuls les vrais secrets et messages privés sont protégés ; captures HTML brutes jamais dans le dépôt

## Sécurité sur le site réel

- Lecture seule : aucune action de jeu (envoi, vote, déplacement, validation d'ordre, clic sur la barre BBCode d'un vrai formulaire)
- Tout accès au site réel ou à un compte exige un mandat explicite d'Arnaud ; préférer les fixtures

## Workflow de test avec Playwright

Pour les tests sur fixtures, voir le skill `tester-kraland-css` (`.claude/skills/` et `.hermes/skills/`).
Après `npm run build`, utiliser `npm run test:zone -- <zone>` ou `npm run test:changed` pendant la boucle rouge/vert ; `npm run test:all` une seule fois à la fin.
Bootstrap 3.3.7 et jQuery 3.3.1 sont embarqués dans `tests/e2e/vendor/` (cascade réelle utilisée par défaut, aucune configuration) ; `KR_BOOTSTRAP_DIR` permet de pointer ailleurs. Captures et journaux hors dépôt. Ne jamais utiliser Chrome 9222/9223 ni le site réel pour ces fixtures.
Pour une vérification visuelle manuelle séparée, attendre 5 secondes après le build pour la synchronisation Tampermonkey, puis vérifier mobile (375×667), bureau (1280×720) et absence d'impact croisé.

Pièges connus :
- Seuils : tester N−1, N et N+1 pour chaque media query, et les transitions dans les deux sens dans le même onglet
- Mini-profil du plateau : tester plié et déplié, à 375 et 700 px
- Cibles tactiles ≥ 44 px (48 px pour la croix directionnelle)
- `scrollIntoView` fait défiler même un conteneur `overflow:hidden` : mesurer avec `scrollTo` + `elementFromPoint`
- « Couvert » n'est pas « invisible » : vérifier `elementFromPoint` avant un tap
- `page.clock` casse `requestAnimationFrame` : capturer le vrai rAF avant `clock.install`
- `addInitScript` s'exécute avant que `<html>` existe
- Valider chaque nouveau test par une contre-épreuve (mutation du module visé → rouge) ; `KR_SCRIPT` rejoue contre un bundle ancien

## Livraison

- Arnaud est le product owner et tranche. Une idée posée en question (« Colorée la date ? ») est une option à évaluer, pas un ticket. Une réponse ne décide que ce qu'elle dit
- PR vers `feature/next`, sans fusion sans accord explicite
- Pas de CI : la preuve est locale (commandes de test nommées, SHA exact, cible de la PR), avec rouge avant / vert après
- Chaque PR embarque `version.json` et le bundle généré : un squash rend les PR sœurs conflictuelles. Au rebase, reprendre ces 2 fichiers de la base, relancer `npm run build`, vérifier que le patch source est inchangé, puis un seul `test:all`. Fusionner une PR à la fois
- Revue/QA indépendante de l'implémentation : la vérification de l'implémenteur ne vaut pas approbation

## Skills

Les skills existent en deux copies identiques : `.hermes/skills/` (Hermes) et `.claude/skills/` (Claude Code). Toute modification, ajout ou suppression d'un skill doit être appliquée aux deux, puis vérifiée par `diff -r .hermes/skills .claude/skills` (sortie vide attendue).

Ne jamais lancer `bmad setup` ni `bmad update` dans ce dépôt (dégradation démontrée) ; seul `--status` est sûr.
