---
title: "Sur le plateau mobile, la première case des accès rapides est plus haute de 8 px"
type: 'bugfix'
ticket: '20'
created: '2026-10-31'
status: 'built'
baseline_revision: '666debd5e11dc88e7b37f6a66393d654889bab8c'
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
  - '{project-root}/_bmad-output/backlog/bug-sur-le-plateau-mobile-la-premiere-case-des-acces-rapides-est-plus-haute-de-8-px.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile (≤ 767 px), `.btn + .btn:where(:not([data-kr-dossier])) { margin-top: 8px !important; }` (`kraland-theme.css` l.4885) bat le `margin: 0` des cases de `.kr-quick-access-buttons` et `.kr-action-grid` (l.12527-12534). Les cases 2 et suivantes reçoivent 8 px de marge haute ; la première, seule à y échapper, est étirée à 52 px par sa rangée (mesuré sur `plateau-qualite-usage` à 375 px : Agir 152×52 en y 329, Matériel 152×44 en y 337).

**Approach:** Exclure les cases de ces deux grilles de la règle d'origine, dans son `:where(:not(...))` (spécificité inchangée, aucune règle ni `!important` nouveau), comme le ticket 10 l'a fait pour `.forum-title`. Le `margin: 0` existant de la grille s'applique alors. Test mobile nouveau dans `plateau-qualite-usage.mjs` (hauteurs égales, `top` égal par rangée, seuils 767/768 et bascule, marge 8 px gardée hors grille), rouge sur le bundle de `666debd`. Les comparaisons avec une base qui mesurent ces cases en mobile reçoivent un masque posé sur la base.

</frozen-after-approval>

## Implementation Notes

Route oneshot : un sélecteur CSS modifié, un fragment de test et des masques de base, moins de 100 lignes.

- `kraland-theme.css` l.4884-4885 : `.btn + .btn:where(:not([data-kr-dossier], .kr-action-grid > .btn, .kr-quick-access-buttons > .btn))`. Spécificité (0,2,0) inchangée. Mesure à 375 px : Agir 152×44, rangées à 329 / 383 / 437 (avant : 329 / 399 / 461). Le bloc des accès rapides perd 24 px, et tout ce qui suit remonte d'autant.
- `tests/e2e/plateau-qualite-usage.mjs` : nouveau fragment `acces-mobile`. `ouvrirCartes` reçoit un paramètre `fixture`. Contrôles à 375 et 767 px, en Kraland clair et en Empire Brun sombre : hauteurs égales (≥ 44 px), même `top` par rangée, marge haute nulle sur chaque case (actions comprises, masquées sur mobile dans la fixture), témoin de deux `.btn` hors grille à 8 px. À 768 px et en bascule 767 → 768 → 767, rendu égal au bundle de `666debd`.
- `tests/e2e/lib/variantes.mjs` : `CORRIGER_BUG20` réécrit la règle minifiée des bases, sur le modèle de `CORRIGER_BUG14`. Il est appliqué aux bases qui comparent le plateau mobile : `plateau-qualite-usage` (cartes, pv), `cartes-pastilles` (`avant`), `typographie-formes` (`avantEspacement`, `avantNettoyage`). La base du fragment `acces-mobile` reste brute.
- Router : `frags` de `plateau-qualite-usage` étendu à `acces-mobile`, et `router.test.mjs` aligné.
- Surprise : le premier `test:all` a échoué sur `typographie-formes#nettoyage` (12 FAIL, hauteur de page −24 px), une base que les zones ciblées ne couvraient pas. `CORRIGER_BUG20` y a été ajouté, puis un second `test:all` a été lancé.

## Review Triage Log

Passe quick : 3 constats ; 2 low corrigés (patch), 1 rejeté.
- low, patch : la hauteur n'était comparée que grille par grille. Ajout d'un contrôle sur toutes les cases affichées des deux grilles.
- low, patch : le nombre d'actions n'était pas contrôlé, donc une grille vide passait. Ajout de `m.actions.length === 4`.
- rejeté, low : le témoin hors grille est posé dans le `body` et non dans un conteneur du plateau. Le critère 2 est tenu à la lettre, et la règle n'a pas de garde de conteneur.

## Verification

**Commands:**
- `npm run build` -- succès, validation postbuild
- `KR_FRAG=acces-mobile node tests/e2e/plateau-qualite-usage.mjs` -- vert ; rouge avec `KR_SCRIPT=/tmp/b20/base.user.js`
- `npm run test:zone -- plateau profil confort-mobile cartes-pastilles typographie-formes` -- vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- exit 0
- `caffeinate -ims npm run test:all` -- 0 FAIL
