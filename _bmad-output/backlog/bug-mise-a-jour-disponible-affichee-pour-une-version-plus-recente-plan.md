---
title: '« Mise à jour disponible » s''affiche quand la version installée est plus récente'
type: 'bugfix'
ticket: '17'
created: '2026-10-31'
status: 'built'
baseline_revision: '2feaf996b8b527f52279d994423b9850aabbb302'
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

**Problem:** `displayVersionInfo` affiche « ⚠️ (mise à jour disponible) » dès que la version publiée (`version.json`) diffère de la version installée (`data.version !== currentVersion`). Un bundle plus récent que la publication (`feature/next`, servi en local) est donc signalé comme périmé.

**Approach:** Extraire la comparaison dans un bloc du cœur pur (`krIsUpdateAvailable(installée, publiée)`) : comparaison numérique segment par segment de `1.0.<timestamp>`, vraie seulement si la publiée est strictement plus récente ; une version illisible (publiée ou installée) ne produit pas d'avertissement. Le mode développement (`__USERSCRIPT_VERSION__`) reste inchangé. Test unitaire (`node --test`) des critères du ticket : `1.0.100`/`1.0.200` avertit, égal ou plus ancien n'avertit pas, publiée illisible n'avertit pas.

</frozen-after-approval>

## Implementation Notes

Oneshot : une fonction pure (~15 lignes) et son appel dans `displayVersionInfo`, un test unitaire, et l'enregistrement du nouveau bloc là où les blocs purs sont listés (`tests/e2e/lib/router.mjs` `PURE_BLOCKS`, `tests/e2e/lib/router.test.mjs`, `tests/unit/pure-loader.test.mjs`).

- `kraland-userscript-template.js:341-361` : bloc pur `version` (`krVersionParts`, `krIsUpdateAvailable`) ; `:7918-7919` : appel `krIsUpdateAvailable(currentVersion, data.version)` à la place de `data.version !== currentVersion`. Branche « mode développement » intacte.
- `tests/unit/version.test.mjs` (nouveau) ; `PURE_BLOCKS.version = ['confinement']` (le routeur impose une zone ; seule `confinement-reseau` touche à `version.json`, et seulement pour son refus).
- Bundle et `version.json` régénérés par `npm run build` ; la fonction est inlinée par la minification, ordre des arguments vérifié dans le bundle.

## Verification

**Commands:**
- `npm run test:unit` -- expected: rouge sur la comparaison de chaînes (contre-épreuve), vert après
- `npm run build`, `npm run lint:css`, `npm run lint:js`, `npm run test:router`, `npm run test:all` -- expected: 0 erreur, VERT

## Review Triage Log

Passe quick du 2026-10-31 : 4 constats, 1 low patché, 1 low rejeté, 2 false.
- false — aucun défaut dans la comparaison ni l'appel (constat de conformité, pas un défaut).
- low, rejeté — l'appel dans `displayVersionInfo` n'est pas testé (arguments inversés passeraient). Réel mais hypothétique ; une fixture servant `version.json` dépasse une correction simple, et le ticket accepte le test unitaire seul. Consigné dans `revue-manuelle.md`.
- low, patch — le commentaire de `PURE_BLOCKS.version` laissait croire que `confinement-reseau` couvre la comparaison : reformulé. Partiellement faux : le routeur lance `test:unit` pour toute modification du template (`router.mjs` : `unitTest = true` sur `.js`).
- false — contre-épreuve non visible dans le diff : faite et consignée (mutation `return installed !== published;` : 3 tests rouges, restauration : 62/62 verts).


Vérification finale (après la dernière modification, base 2feaf996b8b527f52279d994423b9850aabbb302) : `test:unit` 62/62, `test:router` conforme, `lint:css` et `lint:js` 0 erreur, skills identiques, `test:all` 19016 ok, 0 FAIL, VERT.
