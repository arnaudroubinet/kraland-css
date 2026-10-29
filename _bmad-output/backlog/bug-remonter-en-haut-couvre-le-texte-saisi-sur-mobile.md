---
id: 16
type: bug
title: "Sur mobile, « Remonter en haut » couvre la fin du texte saisi"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, « Remonter en haut » couvre la fin du texte saisi

## Description

Sur mobile, le bouton fixe « Remonter en haut » apparaît après 400 px de défilement. Pendant la rédaction d'un kramail, il passe sur le bord droit de la zone de texte : la fin d'environ deux lignes est cachée, là où se trouve le curseur pendant la frappe. Constaté par l'émulation du ticket 7.9 (écart E1, `revue-manuelle.md`, section « Ticket 7.9 »).

## Reproduction

1. Fixture `kramail-repondre.html` (citation préremplie), bundle de d8c8777, émulation 375×667, `isMobile`, `hasTouch`.
2. Toucher la zone de texte, puis réduire le viewport à 375×350 (clavier ouvert).
3. Constaté : bouton de 36×44 px en x 331–367, y 271–315 (`right: 8px`, `bottom: 20px`). Le contenu du champ va jusqu'à x 346 : 15 px de chevauchement sur 44 px de haut.
4. Attendu : aucun pixel du texte saisi sous le bouton (`elementFromPoint` sur chaque ligne rend le champ).
5. Script de mesure : `/Users/arnaud/kraland-css-captures/7.9/travail/de.mjs` (mode `de`).

## Cause Hypothesis

Le ticket 7.7 a réservé une colonne de 52 px à droite d'« Envoyer » pour ce bouton, mais pas à droite de la zone de texte. Le forum n'est pas mesuré : sa fixture n'a pas ce bouton.

## Acceptance Criteria

1. **Texte saisi jamais couvert**
   **Given** la rédaction du kramail (Nouveau, Répondre) et la réponse au forum sur mobile, page défilée de plus de 400 px
   **When** la zone de texte a le focus, viewport à 667 puis 350 px de haut, en Kraland clair et en Empire Brun sombre
   **Then** aucune ligne du texte saisi n'est sous « Remonter en haut »
2. **Bouton conservé hors saisie**
   **Given** la même page sans focus dans un champ
   **When** on défile de plus de 400 px
   **Then** « Remonter en haut » reste visible et touchable (≥ 44 px), à sa place actuelle
3. **Ordinateur inchangé**
   **Given** les mêmes pages à 1280 px
   **Then** le rendu est identique à la base

## Notes

- Assumption : la piste la plus simple est de masquer le bouton pendant que la zone de texte a le focus, sur mobile seulement. Réserver la colonne à côté du champ coûterait 52 px de largeur de saisie.
- Decision: (2026-10-29, orchestrateur, sur mandat « je vais suivre ta recommandation ») E1 est traité comme un bogue, pas accepté.
