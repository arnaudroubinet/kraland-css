# Harmonisation UX, lot 1 : défauts et identité du personnage — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** corriger deux fuites de styles mobiles (H1.1, H1.2) et afficher partout le nom du personnage et la section en cours, avec une seule série d'icônes (H1.3 à H1.6, R1).

**Architecture :** les fuites se corrigent par une garde de page à spécificité nulle (`:where(...)`) sur les règles existantes de `kraland-theme.css`. L'identité passe par un bloc pur `identite` du template (sections de jeu, section active, lecture et mémoire du nom), utilisé par une transformation DOM `applyCharacterIdentity()`, par le mini-profil mobile et par les accès rapides.

**Tech Stack :** userscript vanilla JS (IIFE, `InitQueue`), CSS de surcharge sur Bootstrap 3.3.7, tests e2e Playwright sur fixtures (`tests/e2e/*.mjs`, `run.mjs`), tests unitaires `node --test` sur le cœur pur (`tests/unit/`, `loadPure`).

**Spec :** `_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md` (Component Patterns : Mini-profil, Panneau latéral, Boutons d'accès rapide, Onglets de section ; décisions H1.1 à H1.6, R1), `DESIGN.md` (Components), décisions dans `.memlog.md`. Feuille de route : `docs/superpowers/plans/2026-10-19-harmonisation-ux-feuille-de-route.md`.

## Global Constraints

- Fichiers modifiables : `kraland-theme.css`, `kraland-userscript-template.js`, `tests/**`. Jamais `kraland-userscript-main.user.js` à la main : `npm run build` le régénère, avec `version.json`.
- Mobile : `@media (max-width: 767px)` ; ordinateur : `@media (min-width: 768px)`. Garde de page ajoutée à un sélecteur : `:where(...)` (spécificité nulle).
- JS : guillemets simples, 2 espaces, points-virgules, pas de virgule finale, `===`, accolades obligatoires, `GM.*`.
- Bloc pur (`// @kr-pure-begin identite` … `// @kr-pure-end`) : fonctions et constantes seulement, sans `window`, `document`, `localStorage`, `location`, `console`, `CONFIG` (liste complète : `tests/unit/lib/pure.mjs`, `FORBIDDEN`).
- Tests : fixtures synthétiques seulement, réseau confiné (`confineNetwork`), jamais le site réel ni les Chrome 9222/9223 ; captures hors dépôt.
- Icônes des 5 sections (H1.6) : Agir `fa-bolt`, Matériel `fa-suitcase`, Personnage `fa-user`, Bâtiments `fa-home`, Employés `fa-users`.
- Section active sur ordinateur (H1.5) : texte en demi-gras (600) et filet de la couleur primaire de 3 px sous le bouton, fond inchangé.
- Nom du personnage (R1) : lu sur `/jouer/plateau`, `/jouer/materiel`, `/jouer/bat` dans `#col-left .list-group-item.active` ; mémorisé sous la clé `kr-character-name` ; réutilisé sur `/jouer/perso` et `/jouer/pnj` ; titre natif en repli.
- Commits en anglais, style conventional commits, sans attribution.

## Review Focus

1. **Changement de personnage.** Le joueur passe de Nerys à un autre personnage : la première page de jeu qui affiche un nom écrase la mémoire (test du Task 3 : `Syllabus` remplace `Nerys`).
2. **Nom vide.** Un libellé actif vide ou blanc sur le plateau ne doit jamais être mémorisé ; on garde le titre natif (test du Task 3).
3. **Stockage indisponible.** `localStorage` qui lève (navigation privée) ne doit pas casser la page : lecture et écriture dans un `try/catch`, repli sur le titre natif (test e2e du Task 4, fragment `nom`).
4. **Sous-chemins du plateau.** `/jouer/plateau/<pièce>` reste la section Agir, pour le nom comme pour l'état actif (test du Task 3).
5. **Régressions des zones de référence.** Le forum garde ses décorations mobiles (« sujets · ») et la rédaction du kramail garde sa barre fixe (retirée au lot 7 seulement) : tests de non-régression des Tasks 1 et 2.

---

### Task 1 : fuite du décor des listes de forum sur Personnage (H1.1)

**Files :**
- Modify : `kraland-theme.css`, section « FORUM RP - TRANSFORMATION EN CARDS STYLE REDDIT EXPLORE » (l.7466-7747) : chaque sélecteur qui commence par `body.mobile-mode` devient `body.mobile-mode:where(.page-forum)`.
- Create : `tests/e2e/jeu-identite.mjs` (même squelette que `tests/e2e/report-non-lu.mjs` l.1-80 : `launchBrowser`, `confineNetwork`, routes de fixtures et du Bootstrap embarqué, `addInitScript` avec `GM` simulé et variante, `krReady`, `check()`, fragments `KR_FRAG`).
- Create : `tests/e2e/fixtures/jeu-perso.html` (synthétique, servi à `http://www.kraland.org/jouer/perso`) : `#col-left` avec `.list-group` dont `span.list-group-item.active` vaut « Personnage », `#player-header-section` et `#player-main-panel` (structure de `plateau-minimal.html`), et dans `#col-right` un `.panel.panel-default` « Citoyenneté » avec `.table > tbody > tr` à 2 cellules (icône, valeur).
- Create : `tests/e2e/fixtures/forum-index-rp.html` (synthétique, servi à `/forum/rp`) : `.panel.panel-default` avec la table native de l'index (première cellule `p.nomargin a` + `p.nomargin.tagforum` + `span.tagforum`, deux `td.center` de compteurs, dernière cellule auteur + `span.btn-group.btn-group-xs`).
- Modify : `tests/e2e/lib/router.mjs`, `SUITES` : `{ name: 'jeu-identite', file: 'jeu-identite.mjs', zones: ['plateau', 'profil'], frags: [['fuite-forum'], ['regles-ok'], ['nom'], ['section-active', 'icones']] }`.

**Interfaces :**
- Produces : la suite `jeu-identite` et ses fragments, réutilisés par les Tasks 2, 4 et 5.

- [ ] **Step 1 : écrire les tests du fragment `fuite-forum`** (375×667, `isMobile`, variantes `kraland` et `empire-brun-dark`)
  - `perso : aucune cellule de Citoyenneté ne reçoit le décor du forum` : pour chaque `#col-right .panel-default .table > tbody > tr > td`, `getComputedStyle(td, '::before').content` et `::after` ne contiennent ni « → » ni « sujets ».
  - `index du forum : le décor reste` : sur `forum-index-rp.html`, le `::after` de `td:nth-child(2)` contient « sujets ».
- [ ] **Step 2 : enregistrer la suite et vérifier le routeur** : `npm run test:router` → succès.
- [ ] **Step 3 : vérifier le rouge** : `npm run build && KR_FRAG=fuite-forum node tests/e2e/jeu-identite.mjs` → FAIL sur « perso : aucune cellule… ».
- [ ] **Step 4 : poser la garde `:where(.page-forum)`** sur les sélecteurs de la section l.7466-7747.
- [ ] **Step 5 : vérifier le vert** : même commande → ok ; puis `npm run test:zone -- forum`, `npm run test:zone -- sous-forum` et `npm run test:zone -- kramail` (les tables du kramail pouvaient profiter de la fuite) → aucun FAIL.
- [ ] **Step 6 : commit** : `fix(css): scope forum mobile list decorations to forum pages`.

### Task 2 : barre fixe « ok » sur les Règles (H1.2)

**Files :**
- Modify : `kraland-theme.css`, section « NOUVEAU SUJET » (l.9406-9688) : les règles `button.btn-primary.pull-right` et `button.btn-primary.pull-right:active` deviennent `:where(body.page-kramail-compose, body.page-forum) button.btn-primary.pull-right` (et `:active`).
- Create : `tests/e2e/fixtures/regles-recherche.html` (synthétique, servi à `/regles/base`) : formulaire de recherche, `input.form-control` et `button.btn.btn-primary.pull-right` « ok ».
- Modify : `tests/e2e/jeu-identite.mjs`, fragment `regles-ok`.

- [ ] **Step 1 : écrire les tests du fragment `regles-ok`** (375×667)
  - `règles : le bouton « ok » n'est pas fixé` : `getComputedStyle(btn).position !== 'fixed'`.
  - `rédaction kramail : la barre « Envoyer » reste fixe` : sur la fixture existante `kramail-nouveau.html`, servie à son URL de `kramail-redaction.mjs`, `position === 'fixed'`.
- [ ] **Step 2 : vérifier le rouge** : `KR_FRAG=regles-ok node tests/e2e/jeu-identite.mjs` → FAIL sur « règles… ».
- [ ] **Step 3 : poser la garde** décrite ci-dessus.
- [ ] **Step 4 : vérifier le vert** : le fragment passe ; `npm run test:zone -- kramail` → aucun FAIL.
- [ ] **Step 5 : commit** : `fix(css): keep the fixed send bar on compose pages only`.

### Task 3 : cœur pur de l'identité

**Files :**
- Modify : `kraland-userscript-template.js`, nouveau bloc `// @kr-pure-begin identite` … `// @kr-pure-end`, après le bloc `destinataires`.
- Create : `tests/unit/identite.test.mjs` (même forme que `tests/unit/pagination.test.mjs`, `loadPure('identite')`, `plain`).

**Interfaces :**
- Produces :
  - `KR_GAME_SECTIONS` : tableau de `{ label, url, icon }` dans l'ordre Agir, Matériel, Personnage, Bâtiments, Employés.
  - `krActiveGameSection(pathname: string): string|null` : URL de la section dont `pathname` est l'URL ou un sous-chemin (`/jouer/plateau/…`), sinon `null`.
  - `krCharacterNameFromPage(pathname: string, activeLabel: string|null): string|null` : libellé nettoyé (`trim`) si la section active est `/jouer/plateau`, `/jouer/materiel` ou `/jouer/bat` et que le libellé n'est pas vide ; sinon `null`.
  - `krResolveCharacterName(pathname: string, activeLabel: string|null, storedName: string|null): { name: string|null, store: boolean }`.

- [ ] **Step 1 : écrire les tests unitaires**

```js
test('sections : libellés, URL, icônes (H1.6)', () => {
  assert.deepEqual(plain(KR_GAME_SECTIONS).map(s => [s.label, s.url, s.icon]), [
    ['Agir', '/jouer/plateau', 'fa-bolt'], ['Matériel', '/jouer/materiel', 'fa-suitcase'],
    ['Personnage', '/jouer/perso', 'fa-user'], ['Bâtiments', '/jouer/bat', 'fa-home'], ['Employés', '/jouer/pnj', 'fa-users']]);
});
test('section active, sous-chemins du plateau compris', () => {
  assert.equal(krActiveGameSection('/jouer/plateau/200002-11211-13-7956839652'), '/jouer/plateau');
  assert.equal(krActiveGameSection('/jouer/perso'), '/jouer/perso');
  assert.equal(krActiveGameSection('/forum/rp'), null);
});
test('nom lu seulement sur plateau, matériel, bâtiments', () => {
  assert.equal(krCharacterNameFromPage('/jouer/plateau', ' Nerys '), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/bat', 'Nerys'), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/perso', 'Personnage'), null);
  assert.equal(krCharacterNameFromPage('/jouer/pnj', 'Employés'), null);
  assert.equal(krCharacterNameFromPage('/jouer/plateau', '   '), null);
});
test('résolution et mémoire (R1)', () => {
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Nerys', null)), { name: 'Nerys', store: true });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Nerys', 'Nerys')), { name: 'Nerys', store: false });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Syllabus', 'Nerys')), { name: 'Syllabus', store: true });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/perso', 'Personnage', 'Nerys')), { name: 'Nerys', store: false });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/pnj', 'Employés', null)), { name: null, store: false });
});
```

- [ ] **Step 2 : vérifier le rouge** : `npm run test:unit` → FAIL (bloc « identite » absent).
- [ ] **Step 3 : écrire le bloc pur** avec les quatre membres ci-dessus.
- [ ] **Step 4 : vérifier le vert** : `npm run test:unit` → tous ok.
- [ ] **Step 5 : commit** : `feat(js): add pure character identity helpers`.

### Task 4 : nom du personnage dans le mini-profil et le panneau latéral (H1.3, H1.4, R1)

**Files :**
- Modify : `kraland-userscript-template.js` :
  - `CONFIG` (l.2861) : `CHARACTER_NAME_KEY: 'kr-character-name'` ;
  - nouvelle fonction `applyCharacterIdentity()`, ajoutée à la liste `transforms` d'`applyDOMTransformations` (l.3773) juste avant `addQuickAccessButtons` ;
  - nouvelle fonction `getCharacterName()` ;
  - mini-profil mobile (l.1203-1205) : `const playerName = getCharacterName() || <libellé actif natif>` au lieu de `'Personnage'`.
- Modify : `tests/e2e/jeu-identite.mjs`, fragment `nom`.

**Interfaces :**
- Consumes : `krResolveCharacterName`, `krActiveGameSection` (Task 3).
- Produces : `applyCharacterIdentity(): void` (lit `#col-left .list-group-item.active`, résout, mémorise si `store`, et sur `/jouer/perso` et `/jouer/pnj` remplace le texte du titre actif quand un nom est connu) ; `getCharacterName(): string|null` (nom résolu de la page courante). Lecture et écriture du stockage dans un `try/catch` : une exception laisse le titre natif.

- [ ] **Step 1 : écrire les tests du fragment `nom`**
  - `plateau mobile : le mini-profil affiche le nom lu` : `plateau-minimal.html` (libellé actif « Joueur »), `.mobile-mini-profile-name` vaut « Joueur » et `localStorage['kr-character-name'] === 'Joueur'`.
  - `perso mobile : le mini-profil reprend le nom mémorisé` : `jeu-perso.html` avec `kr-character-name = 'Joueur'` posé par `addInitScript` → « Joueur ».
  - `perso ordinateur : le titre du panneau est le nom` (1280×720) : `#col-left .list-group-item.active` vaut « Joueur ».
  - `perso sans mémoire : titre natif` : sans la clé → mini-profil et titre valent « Personnage ».
  - `stockage indisponible : la page tient` : `addInitScript` qui fait lever `localStorage.getItem` et `setItem` pour `kr-character-name` → titre « Personnage », aucune exception dans `pageerror`.
- [ ] **Step 2 : vérifier le rouge** : `npm run build && KR_FRAG=nom node tests/e2e/jeu-identite.mjs` → FAIL (« Personnage » au lieu de « Joueur »).
- [ ] **Step 3 : implémenter** `CHARACTER_NAME_KEY`, `applyCharacterIdentity()`, `getCharacterName()` et le remplacement de la l.1205.
- [ ] **Step 4 : vérifier le vert** : le fragment passe ; `npm run test:zone -- profil` et `npm run test:zone -- plateau` → aucun FAIL.
- [ ] **Step 5 : commit** : `feat(js): show the character name in the mini-profile and side panel`.

### Task 5 : section active et icônes uniques (H1.5, H1.6)

**Files :**
- Modify : `kraland-userscript-template.js` :
  - `addQuickAccessButtons()` (l.8162-8198) : boutons construits depuis `KR_GAME_SECTIONS` ; le bouton dont l'URL vaut `krActiveGameSection(location.pathname)` reçoit la classe `kr-quick-access-active` ;
  - `findNavigationLinks()` (l.1625-1648) : motifs construits depuis `KR_GAME_SECTIONS` (même icônes).
- Modify : `kraland-theme.css`, dans `@media (min-width: 768px)` : `.kr-quick-access-buttons a.kr-quick-access-active { font-weight: 600; box-shadow: inset 0 -3px 0 var(--kr-primary); }` (fond inchangé).
- Modify : `tests/e2e/jeu-identite.mjs`, fragments `section-active` et `icones`.

**Interfaces :**
- Consumes : `KR_GAME_SECTIONS`, `krActiveGameSection` (Task 3).

- [ ] **Step 1 : écrire les tests**
  - `section-active` (1280×720, `plateau-minimal.html` et `jeu-perso.html`) : le bouton de la page courante porte `kr-quick-access-active`, `fontWeight === '600'` et un `boxShadow` qui contient `inset` et `-3px` ; les quatre autres ont `fontWeight === '400'` et `boxShadow === 'none'`.
  - `icones` : sur ordinateur, les classes d'icônes des accès rapides valent, dans l'ordre, `fa-bolt`, `fa-suitcase`, `fa-user`, `fa-home`, `fa-users` ; en 375×667, les `.mobile-tab-bar .mobile-tab-icon` donnent la même suite.
- [ ] **Step 2 : vérifier le rouge** : `KR_FRAG=section-active,icones node tests/e2e/jeu-identite.mjs` → FAIL.
- [ ] **Step 3 : implémenter** les deux constructions depuis `KR_GAME_SECTIONS`, la classe active et la règle CSS.
- [ ] **Step 4 : vérifier le vert** : les fragments passent ; `npm run test:zone -- plateau` → aucun FAIL (`plateau-qualite-usage` vérifie que libellés et destinations n'ont pas bougé).
- [ ] **Step 5 : commit** : `feat: mark the active game section and unify section icons`.

### Task 6 : clôture du lot

- [ ] **Step 1** : `npm run lint` → 0 erreur.
- [ ] **Step 2** : `npm run build` puis `npm run test:all` une seule fois → `RÉSULTAT` sans FAIL ; noter le SHA testé.
- [ ] **Step 3** : commit du bundle et de `version.json` : `chore: rebuild userscript bundle`.
- [ ] **Step 4** : revue indépendante de la branche (relecteur distinct de l'implémenteur), contre la spec et ce plan.
- [ ] **Step 5** : avec l'accord d'Arnaud, push de la branche et PR vers `feature/next` (corps : décisions couvertes, commandes de test, SHA, rouge avant / vert après).
