---
title: "L'onglet de section actif sur mobile suit la même règle que l'ordinateur"
type: 'refactor'
ticket: '2'
created: '2026-10-22'
status: 'built'
baseline_revision: '19cf4732a158f5648ffbfc4c00fc64afe8469173'
route: 'oneshot'
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

**Problem:** La barre d'onglets mobile marque l'onglet actif dès que l'URL contient le chemin de la section (`includes`), alors que les accès rapides d'ordinateur utilisent `krActiveGameSection` (URL exacte ou sous-chemin suivi de `/`). L'onglet mobile actif n'est vérifié par aucun test.

**Approach:** La barre d'onglets mobile appelle `krActiveGameSection` ; le fragment `section-active` vérifie l'onglet actif (`li.active`, seul `aria-selected="true"`) sur le plateau, un sous-chemin du plateau, Personnage et `/jouer/plateaux`, et le compare à l'accès rapide actif d'ordinateur.

</frozen-after-approval>

## Implementation Notes

Oneshot : une condition dans la création de la barre d'onglets mobile (template, `currentPath.includes(linkData.pattern)`) et une mesure de plus dans `MESURE_SECTIONS`.

## Verification

**Commands:**
- `npm run build && KR_FRAG=section-active node tests/e2e/jeu-identite.mjs` -- expected: rouge sur le bundle d'avant (`/jouer/plateaux`), vert après
- `npm run lint:js`, `npm run test:all` -- expected: 0 erreur, RÉSULTAT : VERT

## Review Triage Log

Passe quick du 2026-10-22 : 3 low, patch.
- low, patch — page hors jeu non vérifiée : fixture du plateau servie à `/forum/rp`, accès rapides présents et aucun actif, aucun onglet actif.
- low, patch — un cas « aucun actif » pouvait passer sans barre ni accès : `verifierSocle` et décompte (5 accès rapides, 5 onglets sur les pages de jeu) ajoutés.
- low, patch — en-tête et libellé du fragment `section-active` mis à jour (règle commune, 375 et 1280 px).

Vérification : contre-épreuve sur le bundle d'avant (`/jouer/plateaux` : onglet Agir actif) : rouge ; fragments `section-active`, `icones` verts ; `lint:js` 0 erreur ; `test:all` vert.
