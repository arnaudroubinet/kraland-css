---
id: 24
type: story
title: "Les titres de modale et d'accordéon, `.xmini` et les liens du pied ont un contrôle absolu de taille"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
---

# Les titres de modale et d'accordéon, `.xmini` et les liens du pied ont un contrôle absolu de taille

## Description

Le sweep 9.12 (fusion 6fbdba0) a retiré de `tests/e2e/typographie-formes.mjs` le miroir `ECHELLE_TICKET45`, qui comparait au bundle de base les titres d'en-tête, `.panel-group .panel-title`, `.modal-title`, `.xmini` et `footer a`. Le fragment `echelle` contrôle les en-têtes de panneau en 17 px / 700, mais aucun contrôle ne vise plus `.modal-title`, `.panel-group .panel-title`, `.xmini` ni `footer a`. Une régression de ces tailles passerait inaperçue. Source : revue indépendante du 9.12 (2026-10-30), constat 6, confirmé par grep (0 occurrence de ces sélecteurs dans la suite).

## Acceptance Criteria

1. **Contrôles absolus**
   **Given** les pages du miroir retiré (Matériel, sous-forum, kramail), Kraland clair et Empire Brun sombre, à 375, 767, 768 et 1280 px
   **Then** `.modal-title` et `.panel-group .panel-title` gardent leur taille et graisse actuelles (valeurs relevées sur HEAD et écrites en dur), `.xmini` et `footer a` sont en 12 px
2. **Contre-épreuve**
   **Given** un bundle muté qui change une de ces tailles
   **Then** le fragment échoue
3. **Produit inchangé**
   Aucune modification de `kraland-theme.css` ni du template.

## Notes

- Assumption : valeurs attendues relevées sur HEAD (rendu actuel accepté), pas recalculées depuis DESIGN.md.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
