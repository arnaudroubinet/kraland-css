---
title: 'Cybermonde : le module des sujets permanents masque des cellules hors forum'
type: 'bugfix'
ticket: '6'
created: '2026-10-20'
status: 'built'
baseline_revision: '2c31521a2bd391e48ed35e732bd84010badbf8da'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, `enrichPermanentTopicsStats` (module PermanentTopics:Icons) agit sur toute page sans `#topics` : sur Cybermonde (`/map`), il ajoute des blocs de compteurs et masque les cellules 2 et 3 des lignes d'au moins 3 cellules (mesuré en réel le 2026-10-20 : 6 blocs, 12 cellules masquées). La garde CSS du ticket 2 a retiré le `display: block !important` qui annulait ce masquage.

**Approach:** Le module ne s'exécute que sur le forum et sa racine (`page-forum`, `page-forum-racine`, classes posées par `addPageTypeClass`), sortie avant tout marquage de ligne ; fixture Cybermonde et contrôles e2e dans la suite `jeu-identite`.

</frozen-after-approval>

## Implementation Notes

Oneshot : une garde de 1 ligne dans le module, une fixture reconstruite et un fragment de test (< 100 lignes). Fixture : reprise de `bmad/ux-lot8:tests/e2e/fixtures/hors-forums/cybermonde-ville.html` (reconstruite), complétée d'un tableau `table nomargin minix` à 5 colonnes, forme mesurée en réel le 2026-10-20 ; la session Kraland du Chrome dédié ayant expiré, aucun relevé de structure supplémentaire.

Fichiers : `kraland-userscript-template.js` (garde dans `enrichPermanentTopicsStats`), `tests/e2e/fixtures/cybermonde-ville.html` (nouvelle), `tests/e2e/jeu-identite.mjs` (fragment `hors-forum-js`), `tests/e2e/lib/router.mjs` (fragment et commentaire), bundle et `version.json` régénérés.
Preuve : bundle d'avant (`KR_SCRIPT` = HEAD `2c31521`) → 4 FAIL (Cybermonde et Personnage à 320 et 375 px, 7 blocs sur Cybermonde) ; après → 20 contrôles verts ; `test:all` 4085+ ok, 0 FAIL ; lint 0 erreur.
Surprise : un `git stash` partiel a échoué (fixture ajoutée en intention) sans rien remiser ; contre-épreuve refaite par `KR_SCRIPT`.

## Review Triage Log

Passe quick du 2026-10-20 : 1 medium, 3 low, 1 false.
- medium, patch — fragment sans contrôle du socle (mode mobile, classes de page, exceptions côté forum) : faux vert possible ; ajouté `verifierSocle` et `erreurs` pour chaque cas.
- low, patch — cas 768 et 1280 px présentés comme preuve de la garde : commentaire précisé (garde mobile seulement).
- low, rejet — Personnage ne vire au rouge que par le marquage : signalé dans le commentaire du fragment, rien à corriger.
- low, patch — commentaire de suite du routeur sans Cybermonde : complété.
- false — références « ticket 1.6 » et « accord du 2026-10-16 » : 1.6 est l'entrée 6 de l'épopée 1 (le plan porte l'id seul, règle du gabarit) ; l'accord est le ticket 1 de `bmad/ux-lot8`, repris dans la spec.

## Verification

**Commands:**
- `npm run build && KR_FRAG=hors-forum-js node tests/e2e/jeu-identite.mjs` -- expected: rouge avant la garde, vert après
- `npm run test:zone -- forum`, `-- sous-forum`, `-- kramail`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

**Manual checks (if no CLI):**
- Validation visuelle d'Arnaud (hitl) sur Cybermonde réel, 375 px et 1280/1440/1920 px, Kraland clair et Empire Brun sombre.
