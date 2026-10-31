---
id: 34
type: bug
title: "`kramail-theme#entete-toucher` est parfois interrompu par une navigation pendant la mesure"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P2
---

# `kramail-theme#entete-toucher` est parfois interrompu par une navigation pendant la mesure

## Description

Pendant `test:all` sur le ticket 19 (worktree b19, base fc76fd4, 2026-10-31), le fragment `kramail-theme#entete-toucher` (ajouté par le ticket 18) a été interrompu : « Execution context was destroyed ». Rejoué seul, il est vert 3 fois sur 3. Les tests doivent être stabilisés en priorité.

## Reproduction

1. `npm run test:all` (concurrence 16), ou `KR_FRAG=entete-toucher node tests/e2e/kramail-theme.mjs` en boucle sous charge.
2. Constaté : erreur « Execution context was destroyed » levée par `TOUCHER_LIGNE` (`tests/e2e/kramail-theme.mjs` ~l.870), sur `page.evaluate(ETAT_LIGNE, …)` qui suit le premier toucher de la ligne.
3. Attendu : aucun fragment interrompu ; la mesure se fait avant que la page soit quittée, ou bien la navigation est attendue puis prise en compte.

## Cause Hypothesis

`toucher` attend la requête de navigation 1000 ms au plus, puis 250 ms fixes. Au bureau, et sur mobile quand le second toucher suit le lien, le clic part vers une autre page. Sous charge, la navigation est validée pendant le `page.evaluate` suivant, et le contexte est détruit. La mesure `apres` court donc contre la navigation. Elle n'a de sens que sur mobile, ou au bureau si le clic est retenu.

## Acceptance Criteria

1. **Plus d'interruption sous charge**
   **Given** `KR_FRAG=entete-toucher` lancé en parallèle de `test:all`, ou en boucle sous charge
   **Then** le fragment est vert sur au moins 30 passes, sans « Execution context was destroyed »
2. **Contre-épreuve conservée**
   **Given** `KR_SCRIPT=<bundle 8a58d08>`
   **Then** `entete-toucher` reste rouge sur mobile seul, comme le commentaire de la suite l'indique (l.111)
3. **Contrôles inchangés**
   **Given** le fragment corrigé
   **Then** il fait les mêmes contrôles qu'avant (menu fermé, URL et cases inchangées, lien suivi au second toucher, clic suivi au bureau)

## Notes

- Assumption : au bureau sans `retenir`, ne pas évaluer `ETAT_LIGNE` après un clic qui navigue (nav1 non nul), ou intercepter la navigation par `page.route` pour rester sur la page. Le choix revient à l'implémenteur.
- Relever pendant la passe les autres usages de `toucher` suivis d'un `page.evaluate` (`entete-menu`), sans les traiter s'ils ne sont pas instables.
