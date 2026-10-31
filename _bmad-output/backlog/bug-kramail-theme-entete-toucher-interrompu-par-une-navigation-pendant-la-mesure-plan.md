---
title: 'kramail-theme#entete-toucher : ne plus mesurer la page pendant la navigation du clic'
type: 'bugfix'
ticket: '34'
created: '2026-10-31'
status: 'built'
baseline_revision: 'b494ba359aec46f7bc77393579f31be304514de5'
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

**Problem:** Dans `TOUCHER_LIGNE` (`tests/e2e/kramail-theme.mjs`), `apres = await page.evaluate(ETAT_LIGNE…)` suit le toucher de la ligne même quand ce toucher a demandé une navigation (bureau sans `retenir`, ou mobile sur un bundle fautif). La navigation, abandonnée par la route de la fixture, valide une page d'erreur ; sous charge, ce commit tombe pendant l'evaluate et le contexte est détruit : le fragment `entete-toucher` plante au lieu de conclure.

**Approach:** Ne pas évaluer `ETAT_LIGNE` après un toucher qui a demandé une navigation (`nav1` non nul) : la page est quittée, `apres` vaut `null`. `verifierToucher` garde les mêmes contrôles (au bureau, `nav1` égal au lien ; sur mobile, `nav1` nul échoue avant toute lecture de `apres`). Correctif côté test seul.

</frozen-after-approval>

## Implementation Notes

Route oneshot : quelques lignes dans un seul fichier de test, cause localisée par la pile d'appel (l.870) et le routage de `ouvrir` (navigation hors `p.url` abandonnée par `r.abort()`, donc page d'erreur validée après coup).

## Verification

**Commands:**
- `npm run build` ; `npm run lint:css` ; `npm run lint:js` ; `npm run test:unit` ; `npm run test:router` -- verts
- `KR_FRAG=entete-toucher node tests/e2e/kramail-theme.mjs` en boucle (>= 30 passes) sous charge -- vert, aucun « Execution context was destroyed »
- `KR_SCRIPT=/tmp/b34-8a58d08.user.js KR_FRAG=entete-toucher node tests/e2e/kramail-theme.mjs` -- rouge sur mobile seul (375, 767), vert à 768 et 1280
- `caffeinate -ims npm run test:all` une fois à la fin, machine calme

Fait : `tests/e2e/kramail-theme.mjs` seul (`toucher` prend un délai d'attente ; `TOUCHER_LIGNE` saute `apres` et `clic` si `nav1` ; `verifierToucher` tolère `apres` nul). Revue : attente portée à 3000 ms au bureau sans `retenir`, et `clic` gardé comme `apres`. Relevé `entete-menu` et doutes : `revue-manuelle.md`, section « Ticket backlog 34 ».

Preuves (base b494ba359aec46f7bc77393579f31be304514de5, non commité) :
- Sonde jetable (abandon de navigation retardé de 400 ms, `ETAT_LIGNE` retardé de 600 ms) : avant, « Execution context was destroyed » dans `TOUCHER_LIGNE` ; après, 14 ok, 0 échec.
- Charge (6 boucles parallèles x 6 passes, 14 processus `yes`) : 36/36 vertes, 0 contexte détruit (avant correctif : 36/36 aussi, course non reproduite par la charge seule).
- `KR_SCRIPT=<bundle 8a58d08>` : 8 ok, 6 échecs, tous sur mobile (375, 767, bascule 375 et 767) ; bureau vert.
- `npm run build`, `lint:css`, `lint:js`, `test:unit` (62/62), `test:router` : verts.
- `caffeinate -ims npm run test:all` : 19186 ok, 0 FAIL, 431 s, VERT (kramail-theme 1195 ok).

## Review Triage Log

Revue quick (sous-agent, 6 points) :
- medium, patch : la lecture `clic` restait non gardée après une navigation. Gardée par `!nav1`.
- medium, patch : `nav1` nul si la requête arrive après 1000 ms, course intacte. Attente de 3000 ms au bureau sans `retenir`.
- false : le critère 3 est tenu (vérifié par le relecteur).
- low, patch : relevé `entete-menu` non consigné. Consigné dans `revue-manuelle.md`.
- false : preuves des critères 1 et 2 absentes. Revue faite avant la passe de preuve ; preuves ci-dessus.
- false : diff figé avant la mise à jour du frontmatter, bundle et `version.json` hors diff. Le diff de revue ne portait que la source ; les deux fichiers générés sont régénérés et seront embarqués.
