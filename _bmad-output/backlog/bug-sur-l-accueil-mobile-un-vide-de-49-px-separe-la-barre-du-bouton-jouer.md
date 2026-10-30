---
id: 29
type: bug
title: "Sur l'accueil mobile, un vide de 49 px sépare la barre du bouton « Jouer »"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur l'accueil mobile, un vide de 49 px sépare la barre du bouton « Jouer »

## Description

Sur le vrai accueil connecté à 375 px, 49 px vides séparent la barre de navigation du bouton « Jouer ». Relevé dans la capture d'Arnaud (ticket 10.6, point non reproduit) puis mesuré au relevé connecté du 2026-10-30.

## Reproduction

1. Vrai `/accueil` connecté, 375×667, Empire Brun sombre, bundle 1.0.1793348337346.
2. Mesurer l'écart entre le bas de la barre et le haut de « Jouer ».
3. Constaté : 49 px = 25 px de `#content` (padding natif de main.css) + 8 px de padding de `.row` + deux `gap` de 8 px.
4. Attendu : marge de page de 16 px sous la barre, comme les autres pages mobiles (DESIGN.md).
5. Captures : `/Users/arnaud/kraland-css-captures/connecte-2026-10-30/p1-accueil-*.png`, relevé `/Users/arnaud/kraland-css-captures/connecte-2026-10-30/releve.md` (point 2).

## Cause Hypothesis

La règle `:where(html.kr-page-accueil) body.mobile-mode > .container > .row` (refonte 10.3) met la rangée en flex avec `gap`. Les pseudo-éléments clearfix de Bootstrap `.row::before` et `.row::after` deviennent des items flex (order 0), rangés avant « Jouer » (order 1) : chacun ajoute un `gap` de 8 px. S'y ajoutent le padding natif de `#content` et celui de `.row`.

## Acceptance Criteria

1. **Écart sous la barre**
   **Given** l'accueil mobile (fixture `accueil.html` connectée), 375 et 320 px, Kraland clair et Empire Brun sombre
   **Then** l'écart entre la barre et « Jouer » est de 16 px (±1)
2. **Ordre et écarts des cartes inchangés**
   **Then** l'ordre des cartes et l'écart de 8 px entre elles restent ceux de la suite `accueil-mobile`
3. **Ordinateur et autres pages inchangés**
   **Given** l'accueil à 768 et 1280 px, et une autre page mobile **Then** rendu identique à la base

## Notes

- Assumption : neutraliser les pseudo-éléments clearfix dans la rangée flex (`display: none` sous la garde) et caler le padding de `#content` sur la marge de page.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
