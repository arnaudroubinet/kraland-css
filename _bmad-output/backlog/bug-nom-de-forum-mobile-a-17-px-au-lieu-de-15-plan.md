---
title: "Sur mobile, le nom de forum des cartes passe à 17 px au lieu de 15"
type: 'bugfix'
ticket: '10'
created: '2026-10-24'
status: 'built'
baseline_revision: '2db3b4c41e2c6c58329b5d7e403733c3c58628c8'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/.claude/skills/tester-kraland-css/SKILL.md'
  - '{project-root}/_bmad-output/backlog/bug-nom-de-forum-mobile-a-17-px-au-lieu-de-15.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/epic-typographie-formes-retrospective.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, `h1, h2, h3 { font-size: var(--kr-font-section-title) !important; }` (l.4782) bat `.forum-title { font-size: var(--kr-font-forum-name); }` (l.8035, sans `!important`). Le template crée un `<h3 class="forum-title">` (l.4899) dans les cartes de forum, donc le nom vaut 17 px au lieu de 15. Aucun test ne le voit : la fixture `palette-nation-textes.html` l.63 porte un `span.forum-title`. Voisins (rétro, F3 et F5) : le commentaire 9h (l.2235) dit que les règles `order` du pied Bootbox mobile « reproduisent l'ordre natif », sans dire qu'elles ne couvrent que `.btn-default` et `.btn-primary` ; le commentaire l.15049 attribue les compacts à 4.3 au lieu de 4.4.

**Approach:** P1 option 4 : réécrire la règle d'origine pour exclure `.forum-title`, sans changer sa spécificité ni ajouter de règle. Corriger les deux commentaires. Mesurer le `h3` réel produit par le template sur `/forum/staff`, avec un rouge avant sur le bundle de la base.

## Boundaries & Constraints

**Always:**
- Règle l.4782 réécrite en `:is(h1, h2, h3):where(:not(.forum-title)) { font-size: var(--kr-font-section-title) !important; }`, sur le modèle de l.4783. La spécificité reste (0,0,1). Elle reste dans `@media (max-width: 767px)` (ouvert l.4081).
- Aucune règle nouvelle, aucun `!important` nouveau dans `kraland-theme.css`. Le 15 px vient de la règle `.forum-title` existante (l.8035).
- F3 : commentaire seul. F5 : commentaire seul (voir Assumptions).
- Test dans `tests/e2e/typographie-formes.mjs`, nouveau fragment `titre-forum`, inscrit dans `KR_FRAG`, dans l'en-tête de la suite et dans `frags` du registre du routeur.
- Écarts attendus des comparaisons avec un bundle de base : masque miroir posé sur la base, jamais sur le bundle courant.
- Rouge avant sur le bundle de `2db3b4c` (identique à `be63eea`), contre-épreuves nommées.

**Ask First:**
- Tout écart mesuré sur un autre élément que `h3.forum-title` (autre titre h1-h3, autre page, ordinateur).
- Toute modification d'ordre réel du pied Bootbox (règles `order`).

**Never:**
- Tailles de l'échelle (4.1), titres de section à 17 px, graisse du nom de forum (700, question ouverte à Arnaud).
- Retirer un jeton de `:root` (Assumptions, A2). Les trois `16px !important` en dur de F5 : hors ticket.
- F4 (h4-h6) : hors ticket.
- Modifier `kraland-userscript-main.user.js` à la main. Git modifiant l'arbre, l'index ou le stash. Site réel, Chrome 9222/9223, `/report`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nom de carte | `/forum/staff` (`forum-index-rp.html`), 375 et 767 px, Kraland clair et Empire Brun sombre | chaque `.forum-card h3.forum-title` en 15 px, graisse 700 ; au moins une carte | 0 carte : FAIL nommé (test vide) |
| Autres titres | même page, h1-h3 visibles de `#col-right` hors `.forum-title` | taille égale au bundle de `2db3b4c` | écart : Ask First |
| Ordinateur | même page, 768 et 1280 px | aucune carte ; h1-h3 égaux à la base | n/a |
| Bascule | même onglet 767, 768, 767 px | 15 px, sans carte, 15 px | n/a |
| Comparaisons de base | suites qui mesurent Staff sous 768 px contre un bundle antérieur | égales grâce au masque posé sur la base | masque absent : FAIL |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` (base `2db3b4c`, 15429 lignes) :
  - l.4780-4783 : commentaire « Typographie mobile » et règle à réécrire (bloc `@media (max-width: 767px)` l.4081). l.4783 h4-h6 : ne pas toucher.
  - l.8034-8043 : `.forum-title` (`--kr-font-forum-name`, 15 px ; 700 ; `line-height: 1.3`), à garder tel quel. Cartes : l.7960-8200.
  - l.2235-2239 : commentaire 9h. Règles visées : l.7061-7067, `body.mobile-mode .modal-footer .btn-primary { order: 2 }` et `.btn-default { order: 1 }` (bloc ≤ 767 l.6780). Pied en colonne : l.2243-2252.
  - l.15048-15049 : « compacts (4.3) » devient « compacts (4.4) » (4.4 = bouton compact, `tickets.toml`).
- Template (`kraland-userscript-template.js`) : `createForumCard` l.4824-4946 (`<h3 class="forum-title">` l.4899) ; module l.4763-4975. Les cartes sont créées seulement en `mobile-mode`, sous `/forum/`, hors index présentés comme le sous-forum (`krForumIsIndexPath` l.110 : racine, RP, HRP, Communauté, Débats). Page de mesure : `/forum/staff`. Aucun changement de template.
- Bundle : règle minifiée actuelle `h1,h2,h3{font-size:var(--kr-font-section-title)!important}`.
- `tests/e2e/lib/variantes.mjs` :
  - l.167 `AVANT_TICKET45` détecte l'après-4.5 par cette chaîne exacte. Après la réécriture, un bundle d'après serait lu « avant 4.5 ». Le détecteur doit reconnaître l'ancienne et la nouvelle forme.
  - l.142 : `ECHELLE_TICKET45` pose `h1, h2, h3 { 17px !important }` sur les bases d'avant 4.5 ; ces bases ont `h3 { 1.25rem !important }`. À ajouter : un masque `TITRE_FORUM_BUG10` (`@media (max-width: 767px) { .forum-title { font-size: 15px !important; } }`, feuille adoptée ; (0,1,0) bat h3) et son détecteur `AVANT_BUG10` (nouvelle règle minifiée absente). Modèle : `MEDIAS_TICKET410` / `AVANT_TICKET410` l.292-294.
- Suites qui comparent Staff mobile à une base, à passer au masque :
  - `forum-index.mjs` l.92 (`open`, chaîne des masques) et l.715-745 (« hors périmètre », index Staff à 375 px, base `81512a3`, `EMPREINTE` avec `font-size` et `line-height`).
  - `typographie-formes.mjs` : miroir de `echelle-forum` l.1170-1192 (Staff à 375, base `d953969`) ; `nettoyage` l.1640+ (Staff, `lignes: true`, base `00b0786`, toutes les propriétés).
- `typographie-formes.mjs` : en-tête des fragments l.1-75, liste des options l.80-95, `ouvrir` l.188 (paramètre `css`), `PAGES_FORUM` l.997. Le nouveau fragment suit `nettoyage` (constante `COMMIT_TITRE_FORUM = '2db3b4c'`, option `KR_SCRIPT_AVANT_TITRE_FORUM`).
- `tests/e2e/lib/router.mjs` : registre l.82 (`frags` de typographie-formes), mot-clé `forum-title` l.154 vers `typographie-formes`, `forum-card` l.142 vers `sous-forum`, `MAX_CITING = 3` l.200 ; `tests/e2e/lib/router.test.mjs`.
- `tests/e2e/fixtures/palette-nation-textes.html` l.63 : `span.forum-title` dans `#carte-forum`. Lu par `palette-nation.mjs` l.757-758 et l.906 (couleur et contour du lien seulement).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/typographie-formes.mjs` -- fragment `titre-forum` (matrice ci-dessus), avec un contrôle statique du bundle courant : nouvelle règle présente avec `:where(:not(.forum-title))`, ancienne absente, `AVANT_TICKET45` et `AVANT_BUG10` faux -- rouge sur `2db3b4c` avant le code.
- [x] `tests/e2e/fixtures/palette-nation-textes.html` -- l.63 alignée sur le template (`<div class="forum-card-header"><h3 class="forum-title">…</h3></div>` dans le lien) -- critère 3 du ticket ; `palette-nation` doit rester vert.
- [x] `kraland-theme.css` -- réécriture l.4782, puis `npm run build`.
- [x] `kraland-theme.css` -- commentaire 9h : les règles `order` rangent `.btn-default` (1) puis `.btn-primary` (2) ; un autre bouton (`.btn-danger`, `.btn-success`, `.btn-warning`) garde `order: 0` et passe en tête. Commentaire l.15049 : 4.4.
- [x] `tests/e2e/lib/variantes.mjs` -- `AVANT_TICKET45` aux deux formes ; `TITRE_FORUM_BUG10` et `AVANT_BUG10` ; doc de chaque export.
- [x] `forum-index.mjs`, `typographie-formes.mjs` (miroir `echelle-forum`, `nettoyage`) -- masque posé sur la base si `AVANT_BUG10(base)` ; ligne « info écart accepté et consigné » dans `forum-index.mjs` -- les comparaisons restent vertes.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs` -- fragment `titre-forum` au registre ; un cas : un hunk sur la règle h1-h3 lance `typographie-formes`.

**Acceptance Criteria:**
- Given le bundle construit, when on cherche `h1,h2,h3{font-size:var(--kr-font-section-title)!important}` dans le bundle, then on ne le trouve pas, et `kraland-theme.css` ne compte aucun `!important` de plus qu'à la base.
- Given `npm run test:zone -- typographie-formes forum sous-forum palette-nation`, when la zone tourne, then 0 FAIL.

## Assumptions

- A1 (F3) : on corrige le commentaire, sans étendre `order`. C'est le plus simple qui dit vrai : aucun rendu ne change. La rétro classe F3 en « defer ». La présence de `.btn-danger` ou `.btn-success` dans une Bootbox du site n'est pas vérifiée. Le critère 2 du ticket admet cette branche.
- A2 (F5) : aucun jeton retiré. Aucune règle CSS ni le template ne lit les cinq jetons. Les tests les lisent : `JETONS` de `typographie-formes.mjs` l.131-139, fragment `jetons`. Ils sont aussi déclarés par DESIGN.md (frontmatter l.54-91) et par le « Always » figé du ticket 4.1. Le critère « lus nulle part » n'est donc pas rempli. Retirer les jetons est une décision de produit (DESIGN.md). On corrige seulement le commentaire 4.3 en 4.4.
- A3 : le nom de carte n'existe que sur Staff et les pages hors index dont le premier tableau liste des forums. L'index RP, HRP, Communauté, Débats et la racine gardent le tableau natif. Avant 4.5, le nom valait 12,5 px (`h3 { 1.25rem !important }`).
- A4 : le test vit dans `typographie-formes.mjs`, la suite de l'échelle (4.5 et 4.7), que le mot-clé `forum-title` du routeur lance déjà. On n'ajoute pas Staff à `echelle-forum` : son plancher de 12 px et ses six largeurs élargiraient le ticket.

## Implementation Notes

- Rouge avant (`KR_SCRIPT=/tmp/kr-bug10/base.user.js`, bundle de `2db3b4c`, identique au bundle de travail avant le code) : `KR_FRAG=titre-forum`, 9 FAIL / 22 ok. Valeur mesurée : `17px/700` pour les 4 cartes de Staff, à 375 et 767 px, Kraland clair et Empire Brun sombre, et aux pas 1 et 3 de la bascule ; contrôle statique rouge. Verts : autres titres égaux à la base, ordinateur sans carte.
- Règle minifiée du bundle : `:is(h1,h2,h3):where(:not(.forum-title)){font-size:var(--kr-font-section-title)!important}` (constante `TITRE_FORUM_REGLE_BUG10` de `lib/variantes.mjs`, lue par `AVANT_TICKET45`, `AVANT_BUG10` et le contrôle statique). `!important` de `kraland-theme.css` : 3311 avant et après.
- Masque `TITRE_FORUM_BUG10` posé sur la base seulement : `forum-index.mjs` (chaîne `jetons`, bundle « avant »), miroir `echelle-forum` et `ouvrirNettoyage` (garde `script !== userscript`).
- Vert après : `titre-forum` 31 ok / 0 FAIL. Zone `typographie-formes forum sous-forum palette-nation` : 0 FAIL sauf `nettoyage` (3 FAIL, page `champ` 375 px, rendu entier sans thème) et `rayons` (1 FAIL, onglet « Dormir » de la modale d'ordre 767 px), sous charge 13,6 et concurrence 16 ; rejoués seuls, machine calme : `nettoyage` 405 ok / 0 FAIL, `rayons` 1458 ok / 0 FAIL. Aucune de ces deux pages n'a de `.forum-title`.
- `test:changed` (élargi au total par incertitude, bundle modifié) : 22 suites vertes ; `typographie-formes` 4 FAIL, tous dans `nettoyage` (`champ` et `composants`, Empire Brun sombre 767 px, page de base entière non rendue : même signature que dans la zone), charge 25. Pas de `.forum-title` sur ces pages ; `nettoyage` rejoué seul et machine calme : 405 ok / 0 FAIL.
- Contre-épreuves (`KR_SCRIPT`, copies hors dépôt) : ancienne règle remise, 9 FAIL ; `.forum-title{font-size:…}` retiré, 8 FAIL (nom à 24 px, h3 de Bootstrap) ; `:not(.forum-title)` sans `:where`, 1 FAIL (contrôle statique). `TITRE_FORUM_BUG10 = ''` (copie restaurée ensuite) : `forum-index` hors-perimetre 2 FAIL (Staff 375), `echelle-forum` 2 FAIL (Staff 375, `H3.forum-title 17px` au lieu de 15px), `nettoyage` 4 FAIL (Staff 375 et 767).
- Contre-épreuve du contrôle « titres h1-h3 de #col-right hors .forum-title égaux à la base » (revue) : `:where(:not(.forum-title, .panel-title))` reste vert sur ce contrôle (`h3.panel-title` garde 17 px par une règle d'en-tête de panneau), seul le contrôle statique rougit. `:where(:not(.forum-title, .page-header))` (copie `/tmp/kr-bug10/m6-page-header.user.js`) : 5 FAIL, dont 4 nommés `titre-forum staff {kraland, empire-brun-dark} {375, 767} px : titres h1-h3 … égaux à la base (2db3b4c)`, `H1.page-header 36px` au lieu de `17px`. Le message d'échec affiche désormais les deux listes (aucune tolérance changée). Fragment vert après : 31 ok / 0 FAIL.
- Après la revue : `npm run build`, `test:router` 0 FAIL, `lint:css` et `lint:js` code 0, `!important` 3311. Zone (`KR_CONCURRENCY=6`) : forum-index, jeu-identite, palette-nation, sous-forum, forum-mobile verts ; `typographie-formes` 4401 ok / 1 FAIL (`nettoyage nouveau empire-brun-dark 375 px`, page de base non rendue, même signature, charge 17,7). `nettoyage` rejoué seul : 405 ok / 0 FAIL.

## Plan Change Log
- Revue 1 : commentaire 9h corrigé. Les règles `order` visent `body.mobile-mode .modal-footer`, donc toute modale mobile, Bootbox ou non. Un enfant sans `order` (0) passe avant `.btn-default` et `.btn-primary`, dans l'ordre du DOM : la rangée `.kr-order-badges` (première enfant, `footer.prepend`) puis un autre bouton. Commentaire seul.
- Revue 2 : contre-épreuve ajoutée pour le contrôle des autres titres (Implementation Notes), message d'échec enrichi.
- Revue 3 : libellé du miroir `echelle-forum` : « masques ECHELLE_TICKET47 et TITRE_FORUM_BUG10 sur le bundle de base ».

## Review Triage Log

## Verification

**Commands:**
- Rouge avant : `git show 2db3b4c:kraland-userscript-main.user.js > /tmp/kr-bug10/base.user.js` (hors dépôt), puis `KR_SCRIPT=/tmp/kr-bug10/base.user.js KR_FRAG=titre-forum node tests/e2e/typographie-formes.mjs` -- FAIL attendus : nom de carte à 17 px (375 et 767, deux variantes, bascule) et contrôle statique. Verts : autres titres égaux à la base, ordinateur. Valeur mesurée notée dans Implementation Notes.
- `npm run build` ; `npm run test:zone -- typographie-formes forum sous-forum palette-nation` ; `npm run test:changed` ; `npm run test:router` (tests/ change) ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, codes de sortie lus. Pas de `test:all` (orchestrateur, une fois à la fin).
- Contre-épreuves (copies mutées du bundle hors dépôt, `KR_SCRIPT`). Chacune donne au moins un FAIL nommé :
  - ancienne règle `h1,h2,h3{…!important}` remise (`KR_FRAG=titre-forum`) ;
  - `.forum-title{font-size:var(--kr-font-forum-name)…}` retiré : le nom tombe au h3 de Bootstrap (`titre-forum`) ;
  - `:where(:not(.forum-title))` remplacé par `:not(.forum-title)` : spécificité (0,1,1), contrôle statique du fragment ;
  - `TITRE_FORUM_BUG10` remplacé par `''` : `forum-index.mjs` (hors périmètre, Staff 375) et miroir `echelle-forum` rouges ;

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css l.2235-2236 | Commentaire 9h : un autre bouton ne passe pas « en tête » dans la modale d'ordre (`.kr-order-badges` à order 0 avant lui) ; règles l.7063-7069 visent toutes les modales mobiles, pas seulement Bootbox | fondé | patch (fixed) | l.2144, l.7063-7069 |
| 2 | quick | typographie-formes.mjs l.2094 | Contrôle « autres h1-h3 égaux à la base » jamais vu rouge | fondé | patch (fixed) | AGENTS.md : contre-épreuve par nouveau test |
| 3 | quick | palette-nation-textes.html l.63 | Fixture alignée mais palette-nation ne mesure pas la taille ; le rouge avant vient de `titre-forum` | rejeté | — | choix assumé du plan, critère 3 tenu par `titre-forum` |
| 4 | quick | typographie-formes.mjs l.1190 | Libellé « masque ECHELLE_TICKET47 » périmé (deux masques possibles) | fondé | patch (fixed) | l.1188 |

## Result

- Built sur la base `2db3b4c` ; constats de revue #1, #2 et #4 corrigés, #3 rejeté (choix du plan).
- `npm run build`, `lint:css`, `lint:js` : exit 0 ; `test:router` : « Routeur conforme ».
- `npm run test:all` : 10412 ok, 2 FAIL en 734 s, machine chargée (charge ~20, autre application en cours). Les 2 FAIL rejoués seuls : `modale-ordre#seuil` 98 contrôles, tous passent ; `typographie-formes#nettoyage` tous passent. Faux FAIL de charge ; `nettoyage` flanche sous charge de façon répétée (base relevée non rendue), suivi en action A10 de la rétro de l'épopée 4.
