---
id: 27
type: bug
title: "Sur mobile, les onglets de la page des notifications collent l'icône au libellé"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, les onglets de la page des notifications collent l'icône au libellé

## Description

Sur la page `/report`, les onglets Rapport et Combats n'ont aucun espace entre l'icône et le libellé sur mobile. Relevé par la vérification en émulation du 2026-10-30 (point 2, reprise du 8.5).

## Reproduction

1. Fixture de la page des notifications, bundle 1.0.1793348337346 (HEAD 1e4de5c).
2. Mesurer l'écart entre l'icône et le libellé de chaque onglet.
3. Constaté : 0,0 px à 375 et 767 ; 3,9 px à 768 et 900.
4. Attendu : un écart visible et constant sur mobile.
5. Captures : `/Users/arnaud/kraland-css-captures/verif-2026-10-30/shots/p2-report-onglets-{375,767,768,900}.png`.

## Cause Hypothesis

Sur mobile, le lien de l'onglet passe en `inline-flex` : l'espace blanc entre l'icône et le texte n'est plus rendu. Il manque un `gap` (ou une marge sur l'icône).

## Acceptance Criteria

1. **Écart sur mobile**
   **Given** les onglets de la page des notifications, 375 et 767 px, Kraland clair et Empire Brun sombre
   **Then** l'écart icône/libellé est de 4 px (valeur de la grille ; à confirmer contre DESIGN.md)
2. **Ordinateur inchangé**
   **Given** 768 et 1280 px **Then** rendu identique à la base

## Notes

- Relevé connecté du 2026-10-30 sur le vrai `/report` : écart de 0 px **sur mobile et sur bureau** (1280). Le critère 2 « ordinateur inchangé » est à revoir : le bureau a le même défaut sur le site.

- Constat voisin non retenu : à 1280 px, la pastille de la cloche chevauche son glyphe de 0,3 à 0,9 px. Accepté, imperceptible.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
