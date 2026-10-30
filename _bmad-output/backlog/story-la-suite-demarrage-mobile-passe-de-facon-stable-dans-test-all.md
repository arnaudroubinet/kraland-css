---
id: 22
type: story
title: "La suite `demarrage-mobile` passe de façon stable dans `test:all`"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: medium
---

# La suite `demarrage-mobile` passe de façon stable dans `test:all`

## Description

Le contrôle `demarrage-mobile#desktop+pire-cas+m1+m-1+s1`, « au plus 4 documents en 6 s », échoue par intermittence : cinq `test:all` de l'épopée 9 et déjà la rétro 7. Rejoué seul, il passe. Ces faux FAIL brouillent la preuve de livraison et poussent à fusionner sur un `test:all` rouge.

Source : `revue-manuelle.md`, rétro 9 (point A5 « Le stabiliser ou le lancer à part ») ; tri du 2026-10-30 (« stabilité de `demarrage-mobile` »). En attendant ce ticket, la suite se lance à part (`npm run test:demarrage`), machine calme, et son résultat seul fait foi.

Le contrôle concerné (`tests/e2e/demarrage-mobile.mjs:248-252`) joue `/forum` et `/kramail` à 375 px avec une largeur fausse (980) jusqu'après le chargement (`lateViewport`), et compte les documents chargés pendant la fenêtre d'absence sous horloge simulée (`settle`, `QUIET_MS` 2500, `MAX_ROUNDS` 10, `MAX_SETTLE_MS` 25000, l.56-58).

## Acceptance Criteria

1. **Cause établie**
   **Given** les journaux des `test:all` rouges de l'épopée 9 et de la rétro 7
   **When** le contrôle est rejoué sous charge (suite en parallèle d'autres zones) et seul
   **Then** le plan consigne le nombre de documents observé à chaque échec et la cause (temps réel contre horloge simulée, charge, ou vrai défaut du garde-fou), avec une preuve
2. **Stable sous charge**
   **Given** l'arbre corrigé
   **When** `npm run test:all` tourne trois fois de suite, puis `demarrage-mobile` cinq fois en parallèle d'autres zones
   **Then** `pire-cas` est vert à chaque tour
3. **Pas de faux vert**
   **Given** le témoin « boucle » du fragment `pire-cas` (script sans garde-fou qui recharge en boucle) et une mutation du garde-fou du produit
   **When** la suite tourne
   **Then** chacun la rend rouge
4. **Seuil intact**
   **Then** la borne « au plus 4 documents » et la largeur de 375 px ne changent pas, sauf décision écrite d'Arnaud ; `npm run test:router` est vert

## Boundaries

- Ne change rien au produit : `kraland-theme.css` et `kraland-userscript-template.js` restent intacts, sauf si le critère 1 prouve un vrai défaut du garde-fou ; dans ce cas, ticket séparé.
- Fixtures inchangées.

## References

- revue — _bmad-output/initiative-harmonisation-ux/revue-manuelle.md, rétro 9, A5
- retro — _bmad-output/initiative-harmonisation-ux/epic-plateau-confort-mobile/epic-plateau-confort-mobile-retrospective.md
- suite — tests/e2e/demarrage-mobile.mjs, fragment `pire-cas`
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : stabiliser ; en attendant, lancer à part.
