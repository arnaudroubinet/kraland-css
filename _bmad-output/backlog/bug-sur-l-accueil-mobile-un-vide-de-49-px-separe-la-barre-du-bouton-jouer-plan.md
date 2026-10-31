---
title: "Sur l'accueil mobile, un vide de 49 px sépare la barre du bouton « Jouer »"
type: 'bugfix'
ticket: '29'
created: '2026-10-31'
status: 'built'
baseline_revision: 'eb09f59677c285cbb76768819223fdd5934402ea'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/.claude/skills/tester-kraland-css/SKILL.md'
  - '{project-root}/_bmad-output/backlog/bug-sur-l-accueil-mobile-un-vide-de-49-px-separe-la-barre-du-bouton-jouer.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur l'accueil mobile, 49 px séparent la barre de « Jouer » : 25 px de padding haut natif de `#content` (main.css du site), 8 px de padding haut de la rangée flex de la peau, et deux `gap` de 8 px dus aux pseudo-éléments clearfix `.row::before` / `::after` de Bootstrap, devenus items flex (ordre 0) rangés avant « Jouer » (ordre 1).

**Approach:** CSS seul, bloc mobile de l'accueil (garde `:where(html.kr-page-accueil)`) : pseudo-éléments clearfix de la rangée masqués, padding haut de `#content` à 0, padding haut de la rangée à la marge de page (16 px). « Jouer » à 16 px (±1) sous la barre ; ordre des cartes et écart de 8 px entre elles inchangés. La fixture `accueil.html` reçoit la règle native relevée (`#content` padding haut 25 px). Nouveau fragment `accueil-mobile#jouer` : 320 et 375 px, Kraland clair et Empire Brun sombre, connecté et déconnecté ; 768 et 1280 px et une autre page mobile égaux à la base.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, bloc « PAGE ACCUEIL - MOBILE » : padding haut de la ligne à `--kr-space-4` (16 px, au lieu de 8) ; `#content` à padding haut 0 ; `::before`/`::after` de la ligne et `.row > .clearfix` (accueil déconnecté de la suite) en `display: none`.
- `.clearfix` : ajouté car la variante déconnectée de la suite porte un bloc `.clearfix` après `#col-t` (structure supposée), qui ajoutait un écart de 8 px (24 px au lieu de 16).
- Fixture `accueil.html` : règle native `#content { padding-top: 25px }` recopiée (relevé connecté du 2026-10-30, 320, 375 et 1280 px). Elle vaut aussi sur ordinateur : la comparaison du fragment `bureau` (même fixture pour les deux bundles) reste égale.
- Tests : nouveau fragment `accueil-mobile#jouer`. `router.test.mjs` mis à jour (liste des fragments, et `accueil.html` désormais lue aussi par `confort-mobile`).

## Verification

**Commands:**
- `KR_FRAG=jouer node tests/e2e/accueil-mobile.mjs` -- rouge sur le bundle de base, vert après.
- `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js KR_FRAG=jouer node tests/e2e/accueil-mobile.mjs` -- rouge.
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes` -- vert.

**Résultats (2026-10-31) :**
- `KR_FRAG=jouer` : 30 ok, 0 FAIL (320/375/767 px, deux variantes, connecté et déconnecté : premier bloc à 16 ± 1 px de la barre, 8 ± 0,5 px de Jouer à Bienvenue).
- Contre-épreuve `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js` : 18 ok, 12 FAIL (49 px connecté, 57 px déconnecté).
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router 0. Zones : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant), 2026-10-31 :
- Aucune autre page mobile comparée à la base : **différé** (garde `:where(html.kr-page-accueil)` ; zones confort-mobile, typographie-formes, palette-nation vertes).
- Bloc `.clearfix` de la variante déconnectée supposé : **doute**, consigné dans revue-manuelle.md (capture demandée).
