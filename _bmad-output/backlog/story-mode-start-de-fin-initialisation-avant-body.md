---
id: 8
type: story
title: "Le mode « start » de fin-initialisation injecte vraiment le bundle avant <body>"
parent: none
covers: []
after: []
assignee: ""
refined: false
hitl: false
risk: low
---

# Le mode « start » de fin-initialisation injecte vraiment le bundle avant <body>

## Description

Dans `tests/e2e/fin-initialisation.mjs`, le mode `start` injecte le bundle dès que `<html>` existe, mais l'observateur ne se déclenche qu'au premier script de la page : dans les fixtures, `<body>` existe déjà. Le cas de production (bundle avant `<body>`) n'est donc pas couvert. La suite reprend la technique de l'option `debut` de `modale-ordre.mjs` (script en tête de `<head>`, avant la balise viewport) et vérifie l'état à l'injection.

## Acceptance Criteria

1. **Injection réellement avant <body>**
   **Given** le mode `start` sur chaque page représentative
   **When** le bundle est injecté
   **Then** `<body>` est absent à l'injection (précondition vérifiée), et les contrôles actuels de la suite passent
2. **Contre-épreuve**
   **Given** un bundle qui suppose `document.body` présent au démarrage
   **When** le mode `start` tourne
   **Then** la suite échoue

## Boundaries

- Must not change: le mode `dcl` et les contre-épreuves existantes.

## References

- parent — none
- modèle — tests/e2e/modale-ordre.mjs, option `debut`

## Notes

- Lié aux bugs 6 et 7 du backlog, qui ne seraient pas passés inaperçus avec ce mode.
