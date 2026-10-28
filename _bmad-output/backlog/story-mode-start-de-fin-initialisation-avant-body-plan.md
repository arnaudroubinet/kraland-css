---
title: 'Le mode « start » de fin-initialisation injecte vraiment le bundle avant <body>'
type: 'chore'
ticket: 8
created: '2026-10-28'
status: 'built'
baseline_revision: '882f62a8947635485340955855c45e9f92a07de4'
route: 'full'
route_source: 'auto'
risk: low
review: ''
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Au mode `start` de `tests/e2e/fin-initialisation.mjs`, l'observateur d'injection n'est livré qu'au premier script de la page ; les fixtures n'ont de script qu'en fin de `<body>`, donc le bundle est évalué après `<body>` et le cas de production (bundle avant `<body>`) n'est pas couvert.

**Approach:** Reprendre l'option `debut` de `modale-ordre.mjs` : au seul mode `start`, servir la page avec un script en tête de `<head>` (avant la balise viewport), relever l'état à l'injection et vérifier la précondition « `<body>` absent, document en cours d'analyse ».

## Boundaries & Constraints

**Always:** précondition vérifiée sur chaque sonde `start` ; contrôles existants inchangés ; aucun réseau.

**Never:** modifier le mode `dcl` (page servie inchangée) ni les contre-preuves existantes ; toucher `kraland-userscript-template.js` (bugs 6 et 7 traités ailleurs) ; éditer le bundle généré à la main.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bundle actuel, mode `start` | 10 pages × largeurs, script en tête | `__krInjection = { body: false, etat: 'loading' }`, contrôles verts | — |
| Mode `dcl` | page inchangée | contrôles inchangés | — |
| Fixture sans `<head>` unique | balise absente ou double | sonde en échec (route rompue, marqueur absent) | pas de faux vert |

</frozen-after-approval>

## Code Map

- `tests/e2e/fin-initialisation.mjs` -- suite modifiée : `probe` (route du document, script d'initialisation), contrôles du mode `start`
- `tests/e2e/modale-ordre.mjs` -- modèle : `PLATEAU_DEBUT`, `window.__krInjection`, `verifierDebut`
- `tests/e2e/lib/router.mjs` -- zone `initialisation`, fragments `start` / `dcl` / `contre-preuves` (inchangé)

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fin-initialisation.mjs` -- ajouter `TETE(html)` (script `window.__krScriptTete` juste après `<head>`, balise `<head>` unique exigée), l'appliquer au document servi si `mode === 'start'`, relever `window.__krInjection = { body, etat }` à l'injection, ajouter le contrôle de précondition au mode `start`, compléter l'en-tête -- couvrir le cas de production

**Acceptance Criteria:**
- Given le mode `start` sur chaque page représentative, when le bundle est injecté, then `<body>` est absent à l'injection (contrôle « précondition du document-start ») et les contrôles actuels passent.
- Given un bundle qui lit `document.body` au démarrage, when le mode `start` tourne, then la suite échoue (alors que l'ancienne suite passait).

## Implementation Notes

- Assumption: script inséré juste après la balise `<head>` (regex `<head(\s[^>]*)?>`, pas `<header>`) plutôt qu'après `<meta charset="utf-8">` comme dans `modale-ordre.mjs` : les fixtures Kramail écrivent `<meta charset="utf-8"/>`. Il précède la balise viewport partout.
- Assumption: précondition stricte `{ body: false, etat: 'loading' }`, contrôle séparé (lisible dans la sortie) plutôt que mêlé aux contrôles existants.
- Assumption: pas de contre-preuve intégrée pour l'AC 2 : la précondition protège déjà la technique ; la contre-épreuve est jouée hors dépôt via `KR_SCRIPT` (voir Result).
- La contre-preuve existante « levée anti-FOUC (revealPage) » tourne au mode `start` : elle est désormais évaluée avant `<body>` elle aussi, et reste verte (code et attente inchangés).
- Bugs 6 et 7 : aucun cas ne rougit sur le code actuel. Bug 7 (`createMobileOverlay`, `document.body` nul) exige une largeur < 768 px à l'injection ; à 375 px la suite émule un mobile (`isMobile: true`), viewport non encore lue, largeur ≈ 980 px au démarrage : chemin non emprunté. Bug 6 (modules des modales) n'est pas observé par cette suite (aucune modale ouverte). Si une largeur étroite sans émulation mobile est ajoutée plus tard, elle rougira jusqu'à la correction du bug 7.

## Plan Change Log

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | tests/e2e/fin-initialisation.mjs | Diff de 66 lignes relu par l'orchestrateur : précondition vérifiée au mode `start`, mode `dcl` inchangé, `TETE` lève si `<head>` absent ou multiple | sans défaut | none | contre-épreuve par KR_SCRIPT (65 échecs en `start`) |

## Verification

**Commands:**
- `npm run build` -- expected: VALIDATION PASSED
- `node tests/e2e/fin-initialisation.mjs` -- expected: exit 0, 21 contrôles « précondition du document-start » ok
- `npm run test:router` -- expected: Routeur conforme
- `npm run lint:css` puis `npm run lint:js` -- expected: exit 0 chacun

## Result

Provisoire, base `882f62a`, worktree `kraland-css-wt8` (modifications non commitées).

- `npm run build` : VALIDATION PASSED (régénère `kraland-userscript-main.user.js` et `version.json`).
- Avant (suite d'origine, `KR_FRAG=start`) : vert, mais bundle évalué après `<body>`.
- Rouge avant : suite modifiée privée de `TETE` (copie `/tmp/wt8/apres-sans-tete.mjs`), `KR_FRAG=start` : exit 1, 21 FAIL, tous « précondition du document-start ».
- Vert après : `node tests/e2e/fin-initialisation.mjs` (tous fragments) : exit 0, 205 ok, 0 FAIL ; marqueur de 222 à 5369 ms.
- Contre-épreuve AC 2 (bundle préfixé par `document.body.setAttribute('data-kr-mute', '1');`, `/tmp/wt8/mute-body.user.js`, via `KR_SCRIPT`) :
  - ancienne suite, `KR_FRAG=start` : exit 0, 0 FAIL (le trou du ticket) ;
  - nouvelle suite, `KR_FRAG=start` : exit 1, 65 FAIL (marqueur absent, anti-FOUC, erreur de page) ;
  - nouvelle suite, `KR_FRAG=dcl` : exit 0 (mode `dcl` inchangé).
- `npm run test:router` : exit 0, Routeur conforme.
- `npm run lint:css` : exit 0. `npm run lint:js` : exit 0 (1 avertissement préexistant, `tests/e2e/report-non-lu.mjs:87`).
