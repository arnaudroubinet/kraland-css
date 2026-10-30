---
title: "Refonte mobile de l'accueil : marge de 16 px, cartes de section, cibles de 44 px, titres de 17 px"
type: 'feature'
ticket: '3'
created: '2026-10-30'
status: 'built'
baseline_revision: 'd00e6f26a874a2cb08b39d20af3ab8b41d25c146'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md', '{project-root}/.claude/skills/tester-kraland-css/SKILL.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, l'accueil (`/`, `/accueil`) n'a ni marge de page (absent de `KR_PAGE_CLASSES`, D9.4), ni carte de section : les cinq blocs vont bord à bord, le contenu est à 12-15 px du bord, les titres à 11-15 px, la croix des Nouvelles fait 27×26 et le lien de nouvelle 32×44 ; l'icône `fa-medkit` (50 px, `.falarge` natif en position absolue) recouvre « Bug ? Problème ? » (spike 10.1).

**Approach:** Poser `kr-page-accueil` et `kr-marge-mobile` par `KR_PAGE_CLASSES` (`^/(?:accueil)?$`), puis réécrire le bloc mobile `.page-accueil` : Forum et Nouvelles en carte de section avec en-tête, Bienvenue et Compteurs en carte sans en-tête, « Jouer » au bouton de 4.2, échelle de 4.5, cibles de 44 px ; fragments E10.1-E10.4 dans `accueil-mobile.mjs`, rouges sur la base puis verts.

## Boundaries & Constraints

**Always:** mobile seul (`max-width: 767px`) ; gardes `:where(html.kr-page-accueil)` ; jetons existants (`--kr-space-*`, `--kr-font-*`, `--kr-radius-*`, `--kr-touch-target`, paires `--kr-arm-*`, `--kr-text-primary`, `--kr-bg-surface`) ; ordre mobile Jouer, Bienvenue, Forum, Compteurs, Nouvelles et `#col-right` masqué (E10.5) ; bureau égal à la base à 768, 769, 1280, 1440 et 1920 px ; nombre de `!important` ≤ 2943 ; bundle par `npm run build`.

**Never:** toucher au bloc ordinateur de l'accueil (l.11179-11495) ni à la cloche ; faire revenir le message du ministre (entrée 5) ; nouveau composant (tuile de compteur…) ; nouveau `!important` ; écriture git ; site réel autrement qu'en lecture (aucun clic, aucun `/report`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| mobile | accueil.html à 320, 375×667, 700, 767 ; Kraland clair, Empire Brun sombre | E10.1 texte de `#content` et du pied à ≥ 16 px des bords ; E10.2 cibles ≥ 44×44 et touchées aux 5 points ; E10.3 cartes à 8 px, rayon 8, fond surface, en-têtes ≥ 48 px, titre 17 px 700 couleur du texte, « Jouer » 4.2 ; E10.4 noms/valeurs 15, détails 13, rien sous 12 ; icône `/aide` sans recouvrement du texte | FAIL nommé par contrôle |
| bascule | 767 ↔ 768 dans le même onglet, deux sens | état mobile puis bureau égal à une ouverture directe | FAIL nommé |
| bureau | 768, 769, 1280, 1440, 1920 | position des textes égale au bundle de base | premier écart |
| contraste | 16 variantes, 375 px | titres de carte, valeurs et libellés des compteurs ≥ 4,5:1 | FAIL par variante |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.307-319 -- `KR_PAGE_CLASSES` : ajouter `{ test: /^\/(?:accueil)?$/, classes: ['kr-page-accueil', 'kr-marge-mobile'] }` (même motif que `body.page-accueil` l.853).
- `kraland-theme.css` l.6919-6930 -- marge `:where(html.kr-marge-mobile)` (ligne principale et pied à `--kr-marge-page`) : réutilisée telle quelle ; carte recule par `calc(var(--kr-space-2) - var(--kr-marge-page))` comme 5.1 (l.8111-8116).
- `kraland-theme.css` l.8101-8140 -- carte de section 5.1 (`body.mobile-mode .panel-default…`) : valeurs reprises (fond surface, rayon md, en-tête 48 px padding 0 16, titre 17 px 700 `--kr-text-primary`) ; aucun bloc de l'accueil n'est `.panel-default` sauf le `.panel` interne des Nouvelles, rendu transparent dans sa carte.
- `kraland-theme.css` l.4831-4849 -- bouton mobile 4.2 (`min-height: var(--kr-touch-target)`, `padding: 12px 20px`, `--kr-font-button`) et l.2447-2453 (paire d'action, bordure `--kr-primary-dark`, ombre `--kr-btn-shadow`) : valeurs de « Jouer ».
- `kraland-theme.css` l.11497-11807 -- bloc mobile `.page-accueil` : réécrit (ordre `order` et `#col-right` gardés).
- `tests/e2e/fixtures/accueil.html` -- ajouter la règle native `.falarge` (dashboard.css du site : 50 px, absolue, top 7, right 27) et un glyphe de substitution pour `.fa-medkit` (Font Awesome non servi).
- `tests/e2e/accueil-mobile.mjs` -- fragments `marge`, `cibles`, `cartes`, `echelle` (E10.1-E10.4, 320/375/700/767, deux variantes), `bascule`, `contraste` (16 variantes) ; bureau étendu à 768/769/1440/1920 ; aides `lib/marges.mjs`, `CONTRASTE`.
- `tests/e2e/lib/router.mjs` l.262 et l.124 -- `accueil-mobile` dans la règle `KR_PAGE_CLASSES` ; nouveaux frags ; `router.test.mjs` l.46 et l.601 suivent.
- Skill `tester-kraland-css` (deux copies) -- ligne Accueil.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/accueil.html`, `tests/e2e/accueil-mobile.mjs` -- fragments E10.1-E10.4, bascule, contraste, bureau étendu -- rouges sur `KR_SCRIPT` = bundle de d00e6f2.
- [x] `kraland-userscript-template.js` -- ligne `KR_PAGE_CLASSES` -- marge mobile et garde de page.
- [x] `kraland-theme.css` -- réécriture du bloc mobile -- cartes, bouton, échelle, cibles, icône `/aide`.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs`, skill (deux copies) -- routage et doc.
- [x] `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` -- section 10.3, doutes.

**Acceptance Criteria:**
- Given le bundle reconstruit, when `npm run test:zone -- accueil-mobile` est lancé, then tous les fragments sont verts ; avec `KR_SCRIPT` = bundle de d00e6f2, les fragments E10.1-E10.4 sont rouges.
- Given une mutation du bloc mobile (copie du bundle dans /tmp), when la suite est relancée, then elle est rouge.
- Given palette-nation, typographie-formes, cloche-notifications, confort-mobile, report et `test:router`, when ils sont lancés, then ils sont verts.

## Implementation Notes

- Règles génériques mobiles en `!important` (listes, en-tête actif, masquages des compteurs et de `#player-header-section`) neutralisées sur l'accueil par une garde à spécificité nulle limitée aux blocs pris en charge (`:where(:not(:where(html.kr-page-accueil) :is(.ds_user, .accueil-forum-section, .kraland-metrics, #player-header-section), … *))`), sans nouvel `!important` ; les lignes natives de l'accueil gardent padding et min-height de 44 px ; ancien bloc mobile (43 `!important`) retiré : 2943 -> 2900.
- `.panel` et `.panel-body` en `!important` lus statiquement par `DECLARATIONS_ESPACEMENT_TICKET49` : non modifiés ; le `.panel` des Nouvelles passe en `display: contents`. Marge basse commune `[class*="col-md-"]` : `#col-t` et `#col-left` en `display: contents`, blocs rangés par `order` (1-5 ; autres blocs de `#col-t` à 3, avant les Compteurs ; autres blocs de `#col-left` à 6).
- Règle globale `.list-group-item.active` (hors media, l.1106) : seule une garde `body.mobile-mode` y est ajoutée, toujours vraie sur bureau, donc rendu bureau inchangé ; la déplacer en media obligerait à la dupliquer pour le bureau. Laissée en place.
- Alerte ministérielle et ancien style `.page-accueil .alert-info` : l'alerte vit dans `#col-right`, masqué sur mobile ; style retiré sans remplacement, carte ministérielle reprise pour l'entrée 5.
- Avatar par `--kr-avatar-size` (72 / 56 px) ; avatar rond et carte ministérielle repris de l'ancien bloc (palette-nation et typographie-formes rouges sans eux).
- Medkit : `.ds_forum > .pull-right` masqué ; fixture : règle native `.falarge` et glyphe de substitution.
- Bureau : colonnes empilées nativement à 768-991 px (col-md), contrôle des trois colonnes à partir de 992 px.
- Vrai /accueil (session déconnectée) : HTML natif lu en mémoire (GET) depuis Chrome 9223, rejoué dans un Chromium local avec le bundle du worktree (Tampermonkey de 9223 ne peut pas être neutralisé proprement) ; pas de Bienvenue, de Forum injecté ni de Jouer ; formulaire de connexion et lignes de forum natives d'abord rangés après les Nouvelles (order 6), corrigé en revue (order 3).

## Plan Change Log

## Review Triage Log

| Constat (lentille quick) | Verdict | Suite |
|---|---|---|
| Section 10.3 de revue-manuelle.md absente | false | tâche encore à faire au moment de la revue ; écrite ensuite |
| Pas de test unitaire de la ligne `KR_PAGE_CLASSES` de l'accueil | low | patch : `/`, `/accueil` et négatifs `/accueils`, `/accueil/`, `/accueil/x` dans `tests/unit/identite.test.mjs` (58 pass) |
| Flash possible avant `DOMContentLoaded` (gardes sans `body.mobile-mode`) | low | rejeté : avant DCL les blocs ne sont que visibles sans style (ils le restent ensuite en carte), correction par garde supplémentaire |
| Contrôle de l'icône « A l'aide ! » vert sans mesure quand masquée ; commentaire trompeur | low | patch : commentaire (masquée, ou visible dans la ligne) ; le contrôle reste rouge sur la base et sous mutation (`.pull-right` affiché) |
| Bascule : erreurs de l'ouverture directe ignorées | medium | patch : erreurs et requêtes hors fixture des deux contextes contrôlées |
| Commentaire `SUITES` de accueil-mobile obsolète | low | patch : entrées 2 et 3 décrites |
| Revue indépendante : accueil déconnecté, formulaire et forum natif après les Nouvelles | high | patch : `#col-t > *` en order 3 ; fragment `deconnecte` (formulaire avant Compteurs, lignes `.ds_forum` à 44 px, marge, cibles, « Se souvenir de moi » 13 px) |
| Revue indépendante : garde `#content *` retire min-height et padding de toutes les lignes de liste | medium | patch : garde limitée aux quatre blocs ; plancher min-height contrôlé |
| Revue indépendante : contrôle medkit faux vert quand masqué | medium | patch : renommé « masquée ou sans recouvrement », état masqué asserté |
| Revue indépendante : retrait du premier texte non mesuré | low | patch : contrôle E10.3 à 16 ± 0,5 px (Compteurs centrés : 16 au moins) |
| Revue indépendante : règle globale l.1106 modifiée hors media | low | justifié (Implementation Notes) |
| Revue indépendante : style `.page-accueil .alert-info` retiré | low | noté : alerte dans `#col-right` masqué |

## Design Notes

« Contenu à 16 px » : intérieur de carte à `--kr-space-4`, carte à 8 px du bord, donc texte à 24 px (≥ 16, E10.1), comme les cartes de 5.1. « Jouer » reste dans la marge de page (16 px), sans carte. L'icône décorative `h3.pull-right` des lignes du forum est masquée sur mobile, comme celle des compteurs (déjà masquée). Libellés des compteurs en `--kr-text-secondary` (le gris actuel tombe à 2,5:1 en clair) et sans capitales (« PERSONNAGES » à 13 px déborde d'une tuile à 320 px).

## Verification

**Commands:**
- `npm run build` -- validation OK.
- `npm run test:zone -- accueil-mobile` ; `KR_SCRIPT=/tmp/kr103/base.user.js node tests/e2e/accueil-mobile.mjs` -- vert ; rouge E10.1-E10.4 sur la base.
- `npm run test:zone -- palette-nation typographie-formes cloche confort-mobile report` -- vert.
- `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- code 0.
- `grep -c '!important' kraland-theme.css` -- ≤ 2943.

**Manual checks (if no CLI):**
- Vrai /accueil en émulation 375×667 et 320, lecture seule, captures dans `/Users/arnaud/kraland-css-captures/10.3/`.

## Result

Accueil mobile refait : `kr-page-accueil` et `kr-marge-mobile` posés par `KR_PAGE_CLASSES` ; Forum et Nouvelles en carte de section avec en-tête de 48 px (17 px gras, couleur du texte), Bienvenue et Compteurs en carte sans en-tête, premier texte à 16 px du bord, Jouer au bouton 4.2, échelle 15/13, cibles de 44 px, medkit masqué ; accueil déconnecté : formulaire de connexion avant les Compteurs, lignes natives à 44 px, « Se souvenir de moi » à 13 px ; bureau égal à la base de 768 à 1920 px. `!important` : 2900 (base 2943). Preuves : `node tests/e2e/accueil-mobile.mjs` vert ; `KR_SCRIPT=/tmp/kr103/base.user.js` rouge (fragments `deconnecte` et `cartes` : 58 FAIL, dont marge, cibles et 13 px déconnectés, retrait, medkit) ; contre-épreuves rouges : `#col-t > *` en order 6 (6 FAIL), ancienne garde `#content *` (6 FAIL, plancher min-height), medkit affiché (8 FAIL), plus celles de la première passe. `npm run test:zone` vert : accueil-mobile, palette-nation, typographie-formes, confort-mobile, cloche-notifications, report-non-lu (8445 ok) et les 21 suites des zones de listes (9996 ok) ; `test:router`, `test:unit` (58 pass), `lint:css`, `lint:js` : code 0. Doutes dans revue-manuelle.md, section Ticket 10.3.
