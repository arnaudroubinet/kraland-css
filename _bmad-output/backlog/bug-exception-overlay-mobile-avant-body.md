---
id: 7
type: bug
title: "Une fenêtre étroite au chargement peut arrêter toute l'initialisation du thème"
parent: none
covers: []
after: []
assignee: ""
refined: false
hitl: false
risk: high
severity: P2
---

# Une fenêtre étroite au chargement peut arrêter toute l'initialisation du thème

## Description

Si le bundle s'exécute avant `<body>` alors que la fenêtre mesure moins de 768 px (fenêtre d'ordinateur étroite), `createMobileOverlay` appelle `document.body.appendChild` et lève une exception. L'initialisation s'arrête : la file d'initialisation ne tourne pas et la page n'est jamais marquée prête. Un téléphone n'est pas touché (980 px au démarrage).

## Reproduction

1. Injecter le bundle avant `<body>` (option `debut` de `tests/e2e/modale-ordre.mjs`) avec une fenêtre de moins de 768 px sans émulation mobile.
2. Constaté (sonde de l'implémenteur du ticket 2.2, 2026-10-22) : exception `document.body` nul dans `createMobileOverlay`, `data-kr-ready` jamais posé. Attendu : initialisation complète.

## Cause Hypothesis

`createMobileOverlay` suppose `document.body` présent quand il est appelé tôt, sans attendre le `DOMContentLoaded`.

## Acceptance Criteria

1. **Initialisation complète**
   **Given** le bundle injecté avant `<body>` dans une fenêtre de 375 et de 767 px, sans émulation mobile
   **When** la page se charge
   **Then** aucune exception, `data-kr-ready` posé, superposition mobile présente
2. **Tests couvrent le cas trouvé et corrigé**
   **Given** une suite d'initialisation avec injection avant `<body>`
   **When** elle tourne
   **Then** elle passe, et échoue sur le bundle d'avant la correction
3. **Ou : aucun changement nécessaire, preuve à l'appui**
   **Given** la reproduction ci-dessus
   **When** elle est rejouée sur le code courant
   **Then** si l'initialisation est complète, le ticket se ferme avec cette preuve

## Boundaries

- Must not change: le comportement au-delà de 768 px et sur téléphone.

## References

- parent — none
- plan — _bmad-output/initiative-harmonisation-ux/epic-modale-ordre/story-modale-d-ordre-fixture-suite-et-module-actif-sur-les-deux-su-plan.md, Review Triage Log
