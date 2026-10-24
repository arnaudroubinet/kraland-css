---
title: "Bouton compact en 12 px pour les votes et la pagination"
type: 'feature'
ticket: '4'
created: '2026-10-24'
status: 'built'
baseline_revision: '3b1da55'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur ordinateur, les votes (`.btn-group-xs` des messages : j'aime, je n'aime pas, score) et les numéros de pagination n'ont pas le rôle « bouton compact » de DESIGN.md (`button-compact` :111 : 12 px, rayon sm 4 px) : la pagination est en 14 px (Bootstrap), les votes en 12 px Bootstrap avec un rayon de 3 px (`.btn-xs`).

**Approach:** Sur ordinateur (`min-width: 768px`), votes et numéros de pagination, et eux seuls, prennent `var(--kr-font-button-compact)` (12 px) et `var(--kr-radius-sm)` (4 px) là où un rayon s'applique aujourd'hui ; hauteur et couleur de la base conservées (Q9, Assumption de l'épopée) ; sur mobile, valeurs de la base inchangées (épopée 9, H9.1).

## Boundaries & Constraints

**Always:**
- Assumption : rayon 4 px posé là où la base arrondit (coins extérieurs des groupes et de la pagination, Bootstrap `:first-child`/`:last-child`) ; les coins intérieurs restent carrés (M8, review-faisabilite.md:173).
- Assumption : « aucun autre bouton en 12 px » = les boutons de la liste de 4.2 restent à 14 px ; les autres boutons natifs `.btn-group-xs` des messages (date, profil, kramail, signaler, lien, citer : exclusions de 4.2) gardent leurs valeurs de la base.
- Pagination visée : `.pagination > li > a|span` du sujet (`forum-sujet.html:15`) et du sous-forum (`.pagination-xsm` générée, `sous-forum-debuter.html:97`) ; pas la pagination à `select` (`.center > ul.pagination:has(select)`, carte), ni `.dataTables_paginate` (kramail 25/50/100), ni celle de l'accueil.
- Hauteur de chaque élément visé égale à la base (± 0,5 px) ; couleurs, fond, bordure égaux à la base.
- P1 option 4 ; rouge avant sur `3b1da55`, contre-épreuves.

**Never:** toucher au mobile ; règle `:focus` ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Votes ordinateur | `forum-sujet.html`, 768, 1280, 1440, 1920 px, Kraland clair et Empire Brun sombre | 12 px, rayon 4 px aux coins arrondis de la base, hauteur et couleurs = base | n/a |
| Pagination ordinateur | sujet et sous-forum, mêmes largeurs | 12 px, rayon 4 px aux coins extérieurs, hauteur et couleurs = base | n/a |
| Mobile | 375, 767 px | votes et pagination = base | n/a |
| Autres boutons | boutons de 4.2 et exclusions | inchangés | n/a |

</frozen-after-approval>

## Code Map

- Jetons `:root` : `--kr-font-button-compact` 12 (l.23), `--kr-radius-sm` 4.
- Pagination : couleurs l.2219-2232 (communes) ; mobile `@media (max-width: 767px)` l.4318-4330 (44 px, ne pas toucher) ; sous-forum ordinateur l.14500-14570 (`ul.pagination:not(:first-of-type)` en ligne du titre, `.pagination-xsm`) ; mobile L5 l.14429+ ; sombre l.3762-3832.
- Votes : `.btn-group-xs` natif (Bootstrap `.btn-xs` 12 px, padding 1px 5px, rayon 3px) ; messages mobiles l.15166 (votes/date, ne pas toucher). Écrire une règle ordinateur dans la section forum existante qui porte les messages, sélecteur limité au groupe de votes (`.pull-right > .btn-group-xs[id^="ajax-"]` ou équivalent prouvé par la fixture).
- Fixtures : `forum-sujet.html:24-28` (votes), :15 (pagination) ; `sous-forum-debuter.html:97,104` (pagination générée).
- Suite : `tests/e2e/typographie-formes.mjs` : nouveau fragment `compact` (ou extension de `boutons`), base = bundle `3b1da55` (constante à côté de `COMMIT_MODALES`), mesure font-size, 4 rayons, hauteur, couleurs ; routeur `tests/e2e/lib/router.mjs` (fragment enregistré, mot-clé si un composant nouveau est mesuré).

## Tasks & Acceptance

**Execution:**
- [x] Fragment de test -- rouge sur `3b1da55`.
- [x] `kraland-theme.css` -- règles ordinateur des votes et de la pagination en jetons.
- [x] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` tourne, then 0 FAIL ; votes et pagination en 12 px / 4 px sur ordinateur, égaux à la base sur mobile.

## Implementation Notes

- Fragment `compact` de `tests/e2e/typographie-formes.mjs` (base `COMMIT_COMPACT = '3b1da55'`, `KR_SCRIPT_AVANT_COMPACT`), enregistré dans `tests/e2e/lib/router.mjs`. Mesure font-size, 4 rayons, hauteur, padding, couleur, fond, bordures ; 375, 767, 768, 1280, 1440, 1920 px, Kraland clair et Empire Brun sombre. Visés sur ordinateur : votes (`.pull-right > .btn-group-xs[id^="ajax-"] > .btn`) et pagination du sujet (`.center > ul.pagination:not(:has(select)) > li > :is(a, span)`) et du sous-forum (pages du sujet, `td:first-child > ul.pagination:not(:first-of-type) > li > a`). Égaux à la base : les mêmes sur mobile et les autres `.btn-group-xs` des messages (date, profil, kramail, signaler…) partout. Sous-forum mobile : pages masquées (lignes en cartes) dans les deux bundles, seul le nombre d'éléments affichés est comparé.
- Rouge sur `3b1da55` : 16 FAIL (votes : rayon 3 px ; pagination du sujet : 14 px), 8 largeurs ordinateur × 2 variantes. Votes déjà en 12 px (Bootstrap `.btn-xs`) ; pagination du sous-forum déjà en 12 px (L6) et rayon 4 px (Bootstrap) : vert dès la base.
- CSS : bloc `@media (min-width: 768px)` en fin de la section MESSAGES DU FORUM V3, gardé par `:where(body.page-forum)` : votes en `var(--kr-font-button-compact)`, rayon `var(--kr-radius-sm)` sur les coins gauches de `:first-child` et droits de `:last-child` (coins que Bootstrap arrondit ; coins intérieurs laissés à 0 par Bootstrap) ; pagination du sujet en `var(--kr-font-button-compact)` avec `line-height: 20px` (14 px × 1,42857 de Bootstrap) pour garder 34 px. Règle L6 du sous-forum : `font-size: 12px` passé en `var(--kr-font-button-compact)` (même valeur).
- Contre-épreuves (bundle muté par `KR_SCRIPT`) : taille de la pagination retirée → 8 FAIL ; rayon haut-gauche des votes retiré → 8 FAIL ; `line-height: 1.2` → 8 FAIL (hauteur 28,4 au lieu de 34) ; bloc passé en `@media all` avec `!important` → FAIL sur mobile (375, 767). Bloc passé en `@media all` sans `!important` : 0 FAIL, la fuite est inerte (règles mobiles en `!important` : pagination 16 px, rayon des votes 6 px).
- Reprise après revue (5 constats) :
  1. La pagination du sujet et les pages du sous-forum (L6) gardaient le 4 px codé en dur de Bootstrap. Les coins extérieurs passent à `var(--kr-radius-sm)` : coins gauches de `li:first-child > a|span`, coins droits de `li:last-child`. Les coins intérieurs restent carrés. Le fragment `compact` ajoute un contrôle de consommation à 1280 px : `--kr-font-button-compact` passé à 13 px et `--kr-radius-sm` à 7 px par une feuille adoptée. Les éléments visés doivent suivre (13 px, 7 px aux coins arrondis par la base).
  2. `AVANT_TICKET44` repère désormais la règle minifiée de la pagination du sujet (`.center>ul.pagination:not(:has(select))>li>:is(a,span){font-size:var(--kr-font-button-compact)`), et non plus la règle des votes. Résultat : faux sur le bundle actuel, vrai sur `81512a3` et `3b1da55`.
  3. Le routeur gagne trois mots-clés vers `typographie-formes` : `.center > ul.pagination`, `ul.pagination:not(:first-of-type)` et `btn-group-xs[id^="ajax-"]`. Un cas a été ajouté dans `router.test.mjs`.
  4. Le padding des éléments visés est comparé à la base, sur ordinateur comme sur mobile.
  5. Le commentaire de `PAGINATION_TICKET44` renvoie à `BOUTONS_TICKET42`.
- Contre-épreuves de la reprise :
  - 4 px littéral sur les coins gauches de la pagination du sujet : 1 FAIL (contrôle des jetons redéfinis, rayons 4 px au lieu de 7 px) ;
  - 4 px littéral sur un coin droit des pages du sous-forum : 1 FAIL ;
  - padding de la pagination du sujet à `6px 11px` : 9 FAIL ;
  - mots-clés retirés du routeur : `test:router` FAIL (zones `forum` seules), conforme une fois les mots-clés rétablis.
- Écart consigné (forum-index `hors-perimetre`, sujet 1440 px) : la pagination du sujet, plus étroite en 12 px, changeait l'empreinte face au bundle « avant » `81512a3`. `PAGINATION_TICKET44` / `AVANT_TICKET44` (`tests/e2e/lib/variantes.mjs`) posent 12 px et `line-height: 20px` sur ces seuls numéros du bundle « avant », comme `BOUTONS_TICKET42` ; tout autre écart reste détecté.

## Plan Change Log

- Revue : le rayon de la pagination passe en jeton, en plus de la taille (constat 1) ; ajout de `tests/e2e/lib/router.test.mjs` (constat 3).
- Ajout hors Code Map : `tests/e2e/forum-index.mjs` et `tests/e2e/lib/variantes.mjs` (écart consigné de la pagination du sujet dans la comparaison « hors périmètre »), même motif que les tickets 4.1 et 4.2.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|------|----------|-------|---------|-------|----------|
| 1 | quick | kraland-theme.css:15528, :14565 | Pagination : rayon 4 px venu de Bootstrap en dur, pas de `var(--kr-radius-sm)` | medium | patch (fixed) | grep `radius-sm` : seulement :root et les votes ; Tasks exige « en jetons » |
| 2 | quick | tests/e2e/lib/variantes.mjs:122 | `AVANT_TICKET44` repère la règle des votes, pas la pagination neutralisée ; casse si 4.8 réécrit les votes | low | patch (fixed) | chaîne minifiée liée aux votes ; repère à lier à la pagination |
| 3 | quick | tests/e2e/lib/router.mjs:141 | Aucun mot-clé pour la pagination du sujet mesurée par `compact` | medium | patch (fixed) | regex l.141 sans `pagination` ; `PURE_BLOCKS.pagination` -> sous-forum seul |
| 4 | quick | tests/e2e/typographie-formes.mjs (compact) | Padding non comparé sur les éléments visés, contrairement aux Implementation Notes | low | patch (fixed) | branche cible : taille/rayons/hauteur/couleurs seulement |
| 5 | quick | tests/e2e/lib/variantes.mjs:108 | Commentaire « comme ETIQUETTES_TICKET41 » vs plan « BOUTONS_TICKET42 » | low | patch (fixed) | texte du commentaire |

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes forum sous-forum messages` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL. (`test:all` : orchestrateur.)

**Résultats (arbre de travail sur `3b1da55`, non commité) :**
- `KR_FRAG=compact node tests/e2e/typographie-formes.mjs` : 16 FAIL avant le CSS, 0 FAIL après.
- `npm run test:zone -- typographie-formes forum sous-forum messages` : 2 FAIL (forum-index hors-perimetre, sujet 1440 px, pagination) avant l'écart consigné ; `KR_FRAG=hors-perimetre node tests/e2e/forum-index.mjs` vert après.
- `npm run test:changed` (élargi au total par `lib/variantes.mjs`) : 6735 ok, 0 FAIL, RÉSULTAT : VERT.
- `npm run test:router` : Routeur conforme ; `npm run lint:css` et `npm run lint:js` : exit 0.
- Après la reprise de revue : `npm run test:zone -- typographie-formes forum sous-forum messages` : 2626 ok, 0 FAIL, RÉSULTAT : VERT ; `npm run test:changed` : 6738 ok, 0 FAIL, RÉSULTAT : VERT ; `npm run test:router` conforme ; `lint:css` et `lint:js` : exit 0.

## Result

Construit le 2026-10-24 sur `3b1da55`. Ordinateur : votes et numéros de pagination (sujet, sous-forum) en `var(--kr-font-button-compact)` et `var(--kr-radius-sm)` aux coins extérieurs, hauteur, padding et couleurs de la base ; mobile inchangé. Revue quick : 5 constats corrigés. `npm run build` validé, `lint:css`/`lint:js` exit 0, `test:router` conforme, `npm run test:all` 6738 ok, 0 FAIL.
