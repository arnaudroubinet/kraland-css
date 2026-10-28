---
title: 'Marge latérale de 16 px : socle et pages de jeu'
type: 'feature'
ticket: '1'
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
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, le texte des pages de jeu et de l'Aide touche le bord : `applyMobileCriticalStyles` met en ligne `!important` le padding des colonnes, conteneurs et lignes à 0, et la feuille empile des paddings contradictoires (15, 10, 15, −10, puis 0). Mini-profil à 12 px, pied de page à 0 px, `.row.t` du plateau à 0 px (H10.1).

**Approach:** Retirer la fonction du template et les paddings morts de la feuille ; poser `kr-marge-mobile` (et `kr-page-jeu`, `kr-page-aide`) sur `<html>` par une table chemin → classes extensible ; sous cette garde, la ligne principale, le pied et le mini-profil prennent `--kr-margin-mobile`, les cartes de section reculent pour rester à 8 px.

## Boundaries & Constraints

**Always:** seuls `kraland-theme.css`, `kraland-userscript-template.js` et `tests/` changent ; bundle et `version.json` par `npm run build` ; aucun nouvel `!important` ; gardes en `:where(html.x)` ; mobile en `@media (max-width: 767px)` ; marge par `var(--kr-margin-mobile)` ; cartes à `var(--kr-space-2)` ; au plus 3 suites citent une classe.

**Never:** carte de personnage du plateau au-delà de la marge (ticket 9.2) ; pages hors jeu et Aide (entrée 4) ; bureau ; boutons ; masque de test ; site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Page de jeu mobile | 5 fixtures de jeu + Aide, 320/375/700/767, clair et sombre | tout nœud texte visible hors défilant ≥ 16 px des deux bords ; cartes de section à 8 px | No error expected |
| Bureau | 768, 769, 1280 | boîtes du texte égales à la base | No error expected |
| Bascule | 767 → 768 → 767 dans le même onglet | 768 égal au chargement direct à 768 ; 767 retrouve la marge | No error expected |
| Hors périmètre | forum, kramail, report à 375 | égal à la base | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` -- `initMobileMode`/`applyMobileCriticalStyles` (~l.614-680) ; `applyVariant` (~l.3704) pose les `kr-page-*` ; `KR_GAME_SECTIONS`/`krActiveGameSection` (~l.292).
- `kraland-theme.css` -- PHASE 1 `.container` (~l.4176), PHASE 3 colonnes (~l.4302), PANNEAU PERSONNAGE (~l.4572), `.row` −10 (~l.4866), socle zéro (~l.6876), mini-profil (~l.5012), carte de section (~l.7945), `.dashboard-section` (~l.5893).
- `tests/e2e/lib/marges.mjs` -- nouvelle aide de mesure.
- `tests/e2e/confort-mobile.mjs`, `tests/e2e/fixtures/aide.html` -- nouvelle suite, fixture synthétique.
- `tests/e2e/lib/router.mjs`, `router.test.mjs`, `package.json` (script `test:zone` lit le routeur) -- zone `confort-mobile`.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- supprimer `applyMobileCriticalStyles` et son appel ; table `KR_PAGE_CLASSES` (motif de chemin → classes) appliquée dans `applyVariant` -- source unique, extensible par l'entrée 4.
- [x] `kraland-theme.css` -- retirer les paddings/marges latéraux de PHASE 1, PHASE 3, PANNEAU PERSONNAGE et `.row` −10 ; bloc « MARGE MOBILE » sous `:where(html.kr-marge-mobile)` -- la marge vient d'un seul jeton.
- [x] `tests/e2e/lib/marges.mjs` -- `textesHorsMarge(page, {marge})` (Range.getClientRects, exclut sr-only, invisible, défilant) et `cible(page, sel)` (boîte + elementFromPoint centre/bords).
- [x] `tests/e2e/confort-mobile.mjs` + `fixtures/aide.html` -- fragments mobile, bureau, bascule, hors périmètre.
- [x] `tests/e2e/lib/router.mjs` (+ test) -- suite, zone, règles de fichier, mots-clés.

**Acceptance Criteria:**
- Given le bundle de la base (`KR_SCRIPT`), when la suite tourne, then le fragment mobile est rouge et les fragments bureau/hors périmètre verts.
- Given une mutation (règle de marge retirée), when la suite tourne, then elle est rouge.

## Implementation Notes

- PHASE 1 (`.container` 15 px) et `.row` −10 px **conservés**, contrairement à la tâche : avant `mobile-mode`, leur retrait faisait déborder la page de 3 px à 767 (innerWidth 770, donc mode bureau). Le socle zéro les bat dès `mobile-mode`.
- Retirés : padding 10 px !important de PHASE 3 et 15 px !important de PANNEAU PERSONNAGE (n'étaient battus que par le style en ligne).
- Le style en ligne servait de repère à deux règles, réécrites sans lui à rendu égal à la base : options de thème de `/profil/interface` (`div[style*="padding-left"]` devient `div[class*="col-"]`, hors sections Alertes et Changements remplies après le chargement) ; colonnes `.nopadding` du panneau personnage (7.1, 15/10 px !important à spécificité d'ID) placées sous `@media (min-width: 768px)` (revue).
- Variable `--kr-marge-page` définie seulement sous `:where(html.kr-marge-mobile) body.mobile-mode` ; mini-profil `padding: 12px var(--kr-marge-page, 12px)` ; cartes de section et `.dashboard-section` de premier niveau (colonne de la ligne principale, à travers `.container-fluid`, colonnes, `.dashboard`, `.dashboard-flex`, hors carte, section et modale) reculent de `var(--kr-marge-page, 0px)` par une règle de même spécificité que la carte (garde en `:where`) ; une carte imbriquée garde ses 8 px dans son parent (revue). Pied de page : `body.mobile-mode > footer` seul, `blockquote footer` intact (revue).
- Suites sœurs (cartes-pastilles comparer/groupes/etiquettes ; typographie-formes nettoyage/espacement) : marge neutralisée sur la page par `SANS_MARGE_PAGE` (lib/marges.mjs, variable à `initial`). Script hors dépôt : bundle testé neutralisé égal à la base sur 16 fixtures à 375 et 767 (0 écart de boîte, retrait, marge, display) ; sans neutralisation, le débordement de typographie-echelle (391 px) disparaît.
- package.json non modifié (test:zone lit le routeur).
- Assumption : l'Aide suit le gabarit des Règles (fixture synthétique `aide.html`, structure réelle non relevée).
- Assumption : barre d'onglets défilante exclue de la mesure des 16 px (texte à 6 px du bord, défilement horizontal).
- Assumption : le rendu de `/profil/interface` ne dépend plus de la course entre l'injection du formulaire et le `DOMContentLoaded` : la grille des options de thème (gap de 12 px) est toujours posée, alors que la base ne la posait que si le style en ligne avait atteint les colonnes.
- Assumption : sans peau, sur mobile, toutes les pages reprennent le padding natif de Bootstrap (15 / −15 px), le style en ligne à 0 n'étant plus posé.
- Assumption : les colonnes ajoutées après le chargement, à 10 px par PHASE 3 dans la base, passent à 0 px comme les autres.
- Mini-profil à 16 px sur les pages de jeu seulement ; 12 px ailleurs (hors périmètre).
- forum-activite#ligne (peau coupée) : le relevé de la base ôte le seul style en ligne de applyMobileCriticalStyles (`STYLE_EN_LIGNE_AVANT_91`) ; peau coupée, #col-right est désormais natif.

## Plan Change Log

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---|---|---|
| 1 | Retrait −8 px des `.panel-default` à toute profondeur : carte imbriquée hors de son parent | patch | Retrait limité aux cartes de premier niveau ; contrôle ETAT des imbriquées (rouge sans garde) |
| 2 | Même constat pour `.dashboard-section` | patch | Même garde d'ascendance |
| 3 | `/profil/interface` ne dépend plus de la course injection / DOMContentLoaded | assumé | Implementation Notes (a) |
| 4 | `.nopadding` bureau gardé par `body:not(.mobile-mode)` hors media | patch | Sous `@media (min-width: 768px)` |
| 5 | Exception `#player-main-panel` : même constat | patch | Idem |
| 6 | `body.mobile-mode footer` vise `blockquote footer` | patch | `body.mobile-mode > footer` |
| 7 | Sans peau, sur mobile, padding Bootstrap natif partout | assumé | Implementation Notes (b) |
| 8 | Colonnes ajoutées après chargement à 0 px, non testé | assumé | Implementation Notes (c) ; revue-manuelle.md |
| 9 | `SANS_MARGE_PAGE` neutralise la marge dans deux suites | report | revue-manuelle.md, retrait au ré-ancrage des bases |
| 10 | `STYLE_EN_LIGNE_AVANT_91` trop large | patch | Deux formes exactes |
| 11 | Fixture Aide synthétique, route `/aide` supposée | report | revue-manuelle.md |
| 12 | Nettoyage des styles en ligne de `.panel-info` peut-être mort | report | deferred-work.md |

## Design Notes

Le style en ligne n'était posé qu'une fois, au chargement, et restait après passage au bureau ; le socle zéro de la feuille (`body.mobile-mode .container, .container-fluid, [class*="col-"]`, `.row`, `.dashboard`) fait déjà le même travail pour tout élément, ajouté ou non. Les paddings de PHASE 3 et PANNEAU PERSONNAGE, plus spécifiques que le socle, n'étaient battus que par le style en ligne : ils partent avec lui.

```css
:where(html.kr-marge-mobile) body.mobile-mode > .container > .row { padding-inline: var(--kr-margin-mobile); }
:where(html.kr-marge-mobile) body.mobile-mode .panel-default:where(:not(.panel-group > *, .modal *)) {
  margin-inline: calc(var(--kr-space-2) - var(--kr-margin-mobile));
}
```

## Verification

**Commands:**
- `npm run build` -- expected: validation OK
- `npm run test:zone -- confort-mobile plateau profil cartes-pastilles typographie-formes` -- expected: vert
- `KR_SCRIPT=/tmp/kr-wt91/base.user.js node tests/e2e/confort-mobile.mjs` -- expected: rouge sur le fragment mobile
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: vert

## Result

Provisoire, avant revue indépendante. Base `e203f8706ec6de04c24d185639df387d868391ad`, worktree non commité ; `test:all` non lancé.

- `npm run build` : validation OK. `npm run lint:css`, `npm run lint:js` : 0 erreur. `npm run test:unit` : 56 ok. `npm run test:router` : conforme. `diff -r .hermes/skills .claude/skills` : vide.
- `node tests/e2e/confort-mobile.mjs` : vert (mobile, bureau, bascule, hors-perimetre ; 375, 700, 767, 768, 769, 1280 ; Kraland clair et Empire Brun sombre).
- Rouge sur la base (`KR_SCRIPT=` bundle de e203f87) : 122 FAIL (mini-profil à 12 px, Aide à 0 px, pied de page, classes absentes) ; bureau et hors périmètre verts. Mutation `--kr-marge-page: 12px` : 60 FAIL ; classe retirée du template : 100 FAIL. forum-activite#ligne sur la base : rouge (style en ligne présent).
- `npm run test:zone -- confort-mobile plateau profil cartes-pastilles typographie-formes transitions demarrage croix palette-nation forum forum-activite kramail modale-ordre` : 11303 ok, 13 FAIL sous charge ; rejoués seuls, verts : breakpoint-switch (nav-large, nav-origine), demarrage, typographie-formes#boutons, forum-activite#ligne (après correction). Reste kramail-redaction#regression (8 FAIL) : son « avant » est `feature/next` (ticket 9.6 inclus, absent de cette base) ; avec `KR_SCRIPT_AVANT=` bundle de e203f87, 12 ok. À rejouer après rebase.

- Correctifs de revue : `npm run build`, `npm run lint:css`, `npm run lint:js` : OK. `npm run test:router` : conforme. `npm run test:zone -- confort-mobile cartes-pastilles typographie-formes forum-activite palette-nation` : 9363 ok, 0 FAIL. Contrôle « carte imbriquée dans son parent » (Aide) : 8 FAIL si la garde d'ascendance est retirée du bundle, vert après. Script hors dépôt : 0 écart avec la base sur 16 fixtures à 375 et 767 ; bascule 767/768 dans les deux sens verte sur Personnage et sur Matériel (colonnes `.nopadding`).
