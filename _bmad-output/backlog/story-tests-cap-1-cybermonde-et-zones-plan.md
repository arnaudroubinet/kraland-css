---
title: "Les tests de CAP-1 couvrent le décor CSS sur Cybermonde, « messages » et les bonnes zones"
type: 'chore'
ticket: '4'
created: '2026-10-22'
status: done
baseline_revision: '26dcc7bf6cd34765cf4664734fc5e06fc04b7e23'
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

**Problem:** La suite `jeu-identite` ne mesure pas le décor CSS du forum sur Cybermonde, son motif de détection ignore « messages », et elle n'est pas relancée quand le module des sujets permanents ou Cybermonde change.

**Approach:** Mesurer les pseudo-éléments des tableaux de Cybermonde et de Personnage (« sujets », « messages », « → ») dans le fragment `hors-forum-js`, ajouter « messages » au motif de `fuite-forum`, rattacher la suite aux zones `sous-forum` et `cybermonde` ; aucun changement de la surcharge.

</frozen-after-approval>

## Implementation Notes

Oneshot : tests et routeur seulement. Contre-épreuve : bundle d'avant le lot 1 (`a6ccd2e`), où le décor du forum s'applique partout.

## Verification

**Commands:**
- `KR_FRAG=fuite-forum,hors-forum-js node tests/e2e/jeu-identite.mjs` -- expected: vert ; rouge avec `KR_SCRIPT` sur le bundle de `a6ccd2e`
- `npm run test:router`, `npm run lint:js`, `npm run test:all` -- expected: conforme, 0 erreur, RÉSULTAT : VERT

Écart consigné : le commentaire ajouté au fragment `nom` par le ticket 3 (`19cf473`) citait le nom de fixture `forum-colonne-native-rp.html` ; la règle du routeur (fixture citée par une suite) la rattachait alors aussi à `jeu-identite`, et `npm run test:router` était rouge sur `26dcc7b` (le `test:all` ne lance pas `test:router`). Commentaire reformulé ici, sans effet sur le comportement.

## Review Triage Log

Passe quick du 2026-10-22 : 4 low, patch.
- low, patch — contre-épreuve « messages » non isolée (le bundle de `a6ccd2e` produit aussi « → » et « sujets ») : bundle muté avec une seule règle `td:first-child::after { content: " messages" }` → 10 FAIL (décor CSS sur Cybermonde et Personnage aux 4 largeurs, `fuite-forum` Personnage dans les deux variantes).
- low, patch — sélection de `jeu-identite` par les zones non verrouillée : test du routeur (hunk `permanent-topic-stats` et hunk Cybermonde → zones `sous-forum` et `cybermonde`, `pickUnits` retient `jeu-identite`) ; contre-épreuve sans les deux zones : rouge.
- low, patch — retouche hors des fragments visés (commentaire du fragment `nom`) : nécessaire, consignée ci-dessus.
- low, patch — en-tête de la suite (fuite-forum, hors-forum-js) mis à jour.

Vérification : fragments `fuite-forum`, `hors-forum-js` verts ; contre-épreuves `a6ccd2e` et « messages » seul : rouges ; `test:router` conforme ; `lint:js` 0 erreur ; `test:all` 4361 ok, 0 FAIL.
