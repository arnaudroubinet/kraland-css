---
id: 6
type: bug
title: "Au démarrage réel de la page, trois modules des modales ne s'installent pas"
parent: none
covers: []
after: ["2.3"]
assignee: ""
refined: false
hitl: false
risk: medium
severity: P2
---

# Au démarrage réel de la page, trois modules des modales ne s'installent pas

## Description

Le bundle s'exécute au tout début du chargement (`@run-at document-start`), avant que `<body>` existe. Trois modules ne s'installent qu'à la condition que `document.body` existe, sans nouvel essai : le correctif de la fenêtre de Parler (`trackOrderModalViewport`), la mise en forme mobile des modales (`enhanceCharacterModal`) et la fermeture au clic sur le fond (`enableModalBackdropClick`). En production, ils seraient donc inactifs ; les tests ne le voient pas car ils injectent le bundle après `<body>`.

## Reproduction

1. Suite `tests/e2e/modale-ordre.mjs`, option `debut` (bundle injecté avant `<body>`, viewport non lue, comme sur un téléphone).
2. Ouvrir une modale d'ordre à 375 px.
3. Constaté (relevé de l'implémenteur du ticket 2.2, 2026-10-22) : ni `data-structure-transformed`, ni pied `kraland-modal-footer`, ni suivi de la fenêtre de Parler. Attendu : modules installés, ou décision explicite de ne pas les installer.

## Cause Hypothesis

Gardes `if (document.body)` dans `initCharacterModalMobile` et dans l'installation des deux autres modules, sans report au `DOMContentLoaded` (le socle du ticket 2.2 a reçu ce report, eux non).

## Acceptance Criteria

1. **Modules installés au démarrage réel**
   **Given** le bundle injecté avant `<body>` à 375 px
   **When** une modale d'ordre puis la modale de Parler s'ouvrent
   **Then** les trois modules agissent comme lorsque le bundle est injecté après `<body>`
2. **Pas de régression de la modale d'ordre**
   **Given** les décisions de l'épopée 2 (avertissement de Dormir jamais replié, ticket 2.3)
   **When** la chaîne mobile s'installe
   **Then** l'avertissement de Dormir reste visible
3. **Tests couvrent le cas trouvé et corrigé**
   **Given** les suites `modale-ordre` et `parler-viewport`
   **When** elles tournent avec une injection avant `<body>`
   **Then** elles passent, et échouent sur le bundle d'avant la correction
4. **Ou : aucun changement nécessaire, preuve à l'appui**
   **Given** les résultats de P2 (point B du protocole)
   **When** ils montrent ces modules actifs sur un vrai téléphone
   **Then** le ticket se ferme avec cette preuve

## Boundaries

- Must not change: le socle du ticket 2.2, l'envoi natif des ordres, le rendu ordinateur.

## References

- parent — none
- plan — _bmad-output/initiative-harmonisation-ux/epic-modale-ordre/story-modale-d-ordre-fixture-suite-et-module-actif-sur-les-deux-su-plan.md, Review Triage Log
- protocole — _bmad-output/initiative-harmonisation-ux/epic-modale-ordre/protocole-p2-vrai-telephone.md, point B

## Notes

- Attend l'entrée 2.3 : réactiver la chaîne mobile actuelle replierait l'avertissement de Dormir.
