---
title: 'Carte de personnage selon sa propre largeur : avatar de 70 px, nom dessous sur deux lignes au plus (H7.1)'
type: 'feature'
ticket: '2'
created: '2026-10-28'
status: 'built'
baseline_revision: 'e203f8706ec6de04c24d185639df387d868391ad'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'orchestrator'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** sur ordinateur, la carte de personnage du plateau (`.dashboard-card`) laisse au nom, à côté de l'avatar de 70 px, entre 42 et 118 px selon la fenêtre (relevé en 15 px sur la base, fixture de 49 noms) : des noms d'un seul mot (« Lothaire », « Kunégonde ») sont coupés, et un mot très long est tronqué sans points de suspension.

**Approach:** la carte devient un conteneur de requête (`container-type: inline-size`, ordinateur seulement) ; sous un seuil de largeur de carte, le nom passe sous l'avatar, sur toute la largeur de la carte, deux lignes au plus, points de suspension au-delà ; au-dessus du seuil, rien ne change. Un mot plus long que la ligne se coupe (`overflow-wrap: anywhere`) au lieu de déborder.

## Boundaries & Constraints

**Always:** avatar 70×70 et cercle de PV de 82 px inchangés ; nom en `--kr-font-name` (15 px) ; règles dans `@media (min-width: 768px)` ; aucune requête média en `max-width` pour le bureau ; aucun nouvel `!important` ; rien ne change sur mobile (375, 767 px).

**Never:** toucher aux règles mobiles de la grille des cartes (sweep, entrée 12) ni aux marges latérales de `#col-right` (entrée 9.1) ; changer le DOM construit par `buildCard` ; régler le chevauchement de l'étiquette « PNJ » ou des actions (hors périmètre).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Carte large | carte ≥ 200 px (groupe du joueur, 1920 px) | nom à côté de l'avatar, rendu égal à la base | aucune |
| Carte étroite | carte < 200 px (autres groupes, 1024 à 1512 px) | nom sous l'avatar, largeur de la carte moins 2×8 px, ≤ 2 lignes, centré | aucune |
| Mot très long | « Kroknorbertodelamarmitepleine » | coupé dans le mot, ≤ 2 lignes, aucun débordement horizontal | aucune |
| Mobile | 375 et 767 px | égal à la base (pas de conteneur) | aucune |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.2599-2707 -- règles globales de la carte : en-tête flex (`.dashboard-card-header`), avatar 82/70 px, `.dashboard-card-name-container` (flex:1, min-width:0), `.dashboard-card-name` (15 px, 600, `-webkit-line-clamp: 2`). Ajouter un bloc `@media (min-width: 768px)` juste après `.dashboard-card-actions a i` (l.~2820), avant « Responsive mobile ».
- `kraland-theme.css` l.2835-2885 -- médias 1920/2560/3840 (grille, avatar 76/84 px) : non touchés.
- `kraland-theme.css` l.13184-13194 -- statut sur deux lignes et `padding-bottom: 30px` du corps sous les actions : réutilisé tel quel.
- `kraland-userscript-template.js` l.4215-4340 (`buildCard`) -- structure : carte > lien > en-tête (avatar-wrapper, name-container > drapeau + nom) ; non modifié.
- `tests/e2e/plateau-qualite-usage.mjs` -- suite sans fragment ; ajouter `KR_FRAG` (`usage` = contrôles actuels, `cartes` = nouveau) et un bundle de base `KR_SCRIPT_AVANT` (défaut `git show e203f87`).
- `tests/e2e/fixtures/plateau-cartes-noms.html` -- nouvelle fixture, 49 noms inventés (courts, longs, mot unique de 29 lettres, PNJ, drapeaux), structure de `plateau-qualite-usage.html` ; routée vers `plateau` par `plateau-` (router).
- `tests/e2e/lib/router.mjs` -- `frags` de la suite, mot-clé `kr-carte-perso|dashboard-card-header|dashboard-card-name-container` vers `plateau`, `cartes-pastilles`, `typographie-formes` ; `router.test.mjs` : un cas.
- Suites citant `dashboard-card` : cartes-pastilles, plateau-qualite-usage, typographie-formes (3, inchangé).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/plateau-cartes-noms.html` -- fixture de 49 noms -- relevé et tests.
- [x] `tests/e2e/plateau-qualite-usage.mjs` -- fragment `cartes` : 1024, 1100, 1280, 1366, 1440, 1500, 1512, 1920 px et seuil 199/200/201 px de carte, Kraland clair et Empire Brun sombre, mobile 375 et 767 comparé à la base -- rouge sur la base.
- [x] `kraland-theme.css` -- conteneur `kr-carte-perso`, `overflow-wrap: anywhere` du nom, requête `(width < 198px)` (contenu ; carte de 200 px avec sa bordure) -- H7.1.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs` -- fragments et mot-clé.

**Acceptance Criteria:**
- Given la fixture de noms, when la fenêtre va de 1024 à 1920 px, then chaque avatar mesure 70×70, aucun nom ne déborde en largeur ni ne dépasse deux lignes.
- Given une carte de 199 px, when elle est rendue, then son nom est sous l'avatar et occupe la largeur de la carte moins 16 px ; à 200 et 201 px il reste à côté.
- Given 1920 px, when on compare à la base, then cartes, avatars et noms ont les mêmes boîtes (hors nom à mot trop long).
- Given 375 et 767 px, when on compare à la base, then cartes, avatars et noms sont identiques.

## Implementation Notes

- Assumption: implémentation directe par l'agent de build, sans sous-agent d'implémentation (mode autonome, périmètre de 3 fichiers sources + tests).
- Seuil : la requête de conteneur mesure la boîte de contenu ; la carte a 1 px de bordure de chaque côté, d'où `(width < 198px)` pour un seuil de 200 px de carte. Vérifié à 199, 200 et 201 px de colonne dans le même onglet.
- Écart à la matrice gelée (« centré ») : le nom sous l'avatar est aligné à gauche, avatar à gauche. Centré, Chromium place les points de suspension du `-webkit-line-clamp` après la ligne centrée et les rogne (« Crapaudière-.. », scrollWidth 125 pour 120). `flex: 0 1 auto` + `justify-content: center` produit le même rognage. À trancher par Arnaud si le centrage est voulu malgré tout.
- Imprécision de la matrice : « largeur de la carte moins 2×8 px ». Le lien `.dashboard-card-link` (Bootstrap `list-group-item`) a un padding de 6px 7.5px : l'en-tête est déjà 15 px plus étroit que la carte. Le nom dessous occupe la largeur de l'en-tête, moins 2×8 px de padding (et le drapeau de 20 px + 6 px d'écart quand il existe). Le test compare le bloc du nom à l'en-tête.
- Verify « cartes de 1512 px égales à la base » : à 1512 px, les cartes des autres groupes mesurent 168 px (comme à 1500) et passent sous le seuil. Seules les cartes ≥ 200 px de 1512 px (groupe du joueur, 213 px) et toutes celles de 1920 px sont comparées à la base.
- `overflow-wrap: anywhere` s'applique à toutes les largeurs de bureau : un mot plus long que la ligne se coupe dans le mot au lieu d'être tronqué sans ellipse, y compris à 1920 px (exclu de l'égalité à la base : garde « nom qui ne débordait pas à la base »).
- Routeur : `plateau-qualite-usage` reçoit les fragments `usage` et `cartes` et `needsBootstrap` ; l'entrée sans fragment de `tests/e2e/durations.json` est retirée (durée orpheline). Mot-clé `kr-carte-perso|dashboard-card-header|dashboard-card-name-container` vers `plateau`, `cartes-pastilles`, `typographie-formes` (3 suites, MAX_CITING respecté).
- Lien symbolique `node_modules` du worktree vers le dépôt principal (non suivi, pour lancer les outils sans `npm install`).

## Plan Change Log

- Écart accepté et consigné, hors Code Map initiale : `typographie-formes` (espacement, nettoyage) et `cartes-pastilles` (groupes bureau) comparent le plateau à des bundles de base anciens et voyaient la carte changer (hauteur +22 px, `container-type`, `overflow-wrap`). Feuille miroir `CARTES_TICKET92` + détecteur `AVANT_TICKET92` dans `tests/e2e/lib/variantes.mjs`, posée sur la base seulement (même mécanisme que `CARTES_TICKET54/55`) ; `ouvrir` de cartes-pastilles reçoit une option `css`. Le rendu de la carte reste prouvé par `plateau-qualite-usage#cartes`.

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | Seuil bureau non couvert (768, 769, 900) ni bascule dans le même onglet | patch | `BUREAUX` reçoit 768, 769 et 900 ; bascule 767 -> 768 -> 767 px dans le même onglet, qui attend `body.mobile-mode` levé puis remis, comparée au chargement direct |
| 2 | Alignement du nom dessous non vérifié | patch | bord gauche du bloc du nom = bord gauche du statut, ±1 px, avec et sans drapeau ; contre-épreuve sans `padding: 0 8px 4px` : 24 FAIL |
| 3 | AC « carte − 16 px » imprécise | patch | Design Notes et Result : « largeur de l'en-tête − 2×8 px, aligné sur le statut » ; bloc figé inchangé |
| 4 | Nom aligné à gauche, statut centré | defer | décision d'Arnaud (centrage impossible sans rogner les points de suspension dans Chromium) |
| 5 | « 1512 égal à la base » non tenu pour toutes les cartes | patch | Design Notes : tenu pour les cartes ≥ 200 px ; les cartes de 168 px sont étroites selon la matrice |
| 6 | `overflow-wrap: anywhere` à 1920 px (kraland-theme.css:2828) | OK | aucune action : 3 noms débordants avant, 0 après ; conforme à DESIGN |
| 7 | effets de bord de `container-type` (kraland-theme.css:2825) | OK | aucune action : ni bloc conteneur fixed, ni empilement, ni rognage nouveau (Chromium 147) |
| 8 | Retrait du miroir `CARTES_TICKET92` sans événement certain | patch | retrait à l'entrée 12 de l'épopée 9 (sweep), qui réaligne les bases, sur le modèle des autres miroirs |
| 9 | le miroir masque-t-il une régression ? (tests/e2e/lib/variantes.mjs:416) | OK | aucune action : feuille identique au bundle, base seule, bornée par `AVANT_TICKET92` |
| 10 | Comparaison mobile limitée à 375 et 767 px | patch | 700 px ajouté ; styles de la règle (conteneur, coupure, bloc du nom) comparés à la base ; mutation « hors @media » rouge à 375, 700 et 767 px |
| 11 | actions de carte 24×24 au-dessus de 768 px (kraland-theme.css:2800) | OK | hors périmètre : préexistant, mobile couvert par l’entrée 5 |
| 12 | données de la fixture (tests/e2e/fixtures/plateau-cartes-noms.html) | OK | aucune action : noms inventés, images génériques, aucun jeton |

## Design Notes

Seuil de 200 px : à côté de l'avatar, le nom dispose alors de 118 px (92 px avec drapeau), assez pour un mot de 10 lettres en 15 px gras. Relevé de la base (cartes autres groupes / groupe du joueur) : 1024 : 179/273 ; 1100 : 196/299 ; 1280 : 174/236 ; 1366 : 189/255 ; 1440 : 201 ; 1500 : 167/211 ; 1512 : 168/213 ; 1920 : 217.

Assumption: le seuil porte sur la largeur de la carte, pas sur la longueur du nom (une grille homogène ; la CSS ne sait pas si un nom tient).
Assumption: nom et drapeau centrés sous l'avatar, comme le statut (`text-align: center`) ; avatar centré. (Abandonné à l'implémentation : voir Implementation Notes, alignement à gauche.)
Assumption: à 1512 px, les cartes des autres groupes (168 px) passent sous le seuil : la plage de troncature remesurée en 15 px va de 1024 à 1512 px au moins ; seules les cartes de 1512 px de largeur ≥ 200 (groupe du joueur, 213 px) et toutes celles de 1920 px restent égales à la base.
Assumption: aucune garde de page : `.dashboard-card` n'est construite que sur le plateau (`isPlatoPage`).

Largeur du nom dessous : « largeur de l'en-tête − 2×8 px, aligné sur le statut ». L'en-tête est 15 px plus étroit que la carte (padding de 7.5 px du lien Bootstrap) ; le bloc du nom, avec 8 px de padding de chaque côté, commence au même bord gauche que le statut (corps de carte, padding 8 px). L'AC « la largeur de la carte moins 16 px » a été lue ainsi ; le bloc figé reste inchangé.

Condition « cartes de 1512 px égales à la base » : tenue pour les cartes de 200 px et plus (groupe du joueur, 213 px). À 1512 px, les cartes de 168 px des autres groupes sont des cartes étroites au sens de la matrice (ligne « Carte étroite », 1024 à 1512 px) : leur nom passe sous l'avatar, elles ne sont pas comparées à la base.

## Verification

**Commands:**
- `npm run build` -- succès et validation.
- `KR_SCRIPT=/tmp/kr92/base.user.js KR_FRAG=cartes node tests/e2e/plateau-qualite-usage.mjs` -- rouge (contre-épreuve).
- `npm run test:zone -- plateau cartes-pastilles typographie-formes` -- vert.
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `diff -r .hermes/skills .claude/skills` -- verts, sortie vide.

## Result

Provisoire (après correctifs de revue, avant nouvelle revue), worktree `wt/9.2`, base e203f87, non commité. Statut in-review.

- Rouge sur la base : `KR_SCRIPT=/tmp/kr92/base.user.js KR_FRAG=cartes node tests/e2e/plateau-qualite-usage.mjs` donne 42 FAIL (avant l'ajout des correctifs de revue).
- Contre-épreuves des correctifs : sans `padding: 0 8px 4px`, 24 FAIL (« bord gauche égal à celui du statut ») ; règle sortie de son `@media`, rouge à 375, 700 et 767 px dans les deux variantes.
- Vert après : fragments `cartes` (768 à 1920 px, bascule 767 -> 768 -> 767, seuil 199/200/201, mobile 375/700/767) et `usage` verts.
- Nom dessous : largeur de l'en-tête − 2×8 px, aligné sur le statut (lecture de l'AC « carte − 16 px »). « 1512 égal à la base » est tenu pour les cartes ≥ 200 px ; les cartes de 168 px sont étroites selon la matrice.
- `npm run build` validé. `npm run test:zone -- plateau cartes-pastilles typographie-formes palette-nation` : 9411 ok, 5 FAIL en 828 s (machine chargée), tous hors carte (`cartes-pastilles#forum`, modale de pouvoir ; `breakpoint-switch#nav-large` et `#nav-origine`, hauteur de la barre). Les trois fragments sont verts une fois relancés seuls. La passe précédente, sur la machine calme : 7917 ok, 0 FAIL ; palette-nation et initialisation : 1577 ok, 0 FAIL.
- `test:router`, `lint:css`, `lint:js` (1 avertissement préexistant, report-non-lu.mjs) : verts.
- Ouvert pour Arnaud : constat 4 (nom à gauche, statut centré).
