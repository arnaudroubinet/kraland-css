---
id: 30
type: bug
title: "Sur mobile, la pagination des Contacts déborde de la page"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, la pagination des Contacts déborde de la page

## Description

Sur la vraie page Contacts du kramail à 375 px, la page défile horizontalement : la pagination DataTables sort du tableau défilant. Relevé connecté du 2026-10-30 (point 4).

## Reproduction

1. Vraie page Contacts, connecté, 375×667, Empire Brun sombre, bundle 1.0.1793348337346.
2. Mesurer `document.documentElement.scrollWidth`.
3. Constaté : 459 px pour 375 ; l'élément qui dépasse est `#topics_paginate`, hors du conteneur défilant du tableau.
4. Attendu : `scrollWidth` = 375 ; seul le tableau défile dans son cadre (décision « Contacts mobile en tableau qui défile »).
5. Captures : `/Users/arnaud/kraland-css-captures/connecte-2026-10-30/p4-*.png`.

## Cause Hypothesis

Le cadre défilant du tableau (décision du tri du 2026-10-30) n'englobe pas `.dataTables_paginate`, qui garde sa largeur native (boutons en ligne).

## Acceptance Criteria

1. **Pas de défilement horizontal de page**
   **Given** la page Contacts mobile (fixture avec assez de contacts pour paginer), 375 et 320 px
   **Then** `scrollWidth` de la page = largeur du viewport
2. **Pagination utilisable**
   **Then** les boutons de pagination restent visibles et touchables (≥ 44 px), sur une ou plusieurs lignes
3. **Ordinateur inchangé**
   **Given** 768 et 1280 px **Then** rendu identique à la base

## Notes

- La fixture actuelle des Contacts n'a peut-être pas de pagination : l'ajouter, d'après la structure DataTables du site.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
