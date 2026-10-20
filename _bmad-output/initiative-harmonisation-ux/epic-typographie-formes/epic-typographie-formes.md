---
type: epic
title: "Même rôle, même taille, même forme"
parent: initiative-harmonisation-ux
covers: [CAP-5]
after: []
assignee: ""
risk: high
---

# Même rôle, même taille, même forme

## Description

Un même rôle a même texte, même bouton, même rayon et même espacement sur toutes les pages, ordinateur et mobile.

## Outcome

Les pages se lisent et se touchent de la même façon ; intent de CAP-5.

## Done when

1. Les critères success de CAP-5 tiennent sur les pages de jeu, du forum et du kramail.
2. « Valider » de la modale (18 px, 52 px de haut sur mobile) suit la taille normale.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 4. Traite les boutons (≥ 44 px sur mobile) ; les autres cibles tactiles restent à l'épopée 9. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-5
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 4
- ux — DESIGN.md, Typography, Layout & Spacing, Shapes
- faits — notes-implementation.md, Listes à établir avant le CSS

## Notes

- Waits on epic-identite-et-defauts because: P1.
- Waits on epic-palette-nation because: jetons de couleur et anneau de focus.
- Open question: Q8, Q9, Q11, Q12, Q14 (EXPERIENCE.md) à trancher au plan.
