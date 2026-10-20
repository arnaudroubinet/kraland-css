---
type: epic
title: "Notifications"
parent: initiative-harmonisation-ux
covers: [CAP-9]
after: []
assignee: ""
risk: medium
---

# Notifications

## Description

Le joueur lit son rapport sans effort et en voit davantage d'un coup : popup 900×800 sur ordinateur, date au-dessus du texte sur mobile.

## Outcome

Le rapport du jour se lit vite ; intent de CAP-9.

## Done when

1. Les critères success de CAP-9 tiennent ; aucun chargement de `/report` à l'avance (un GET marque tout lu).
2. La suite `report-non-lu` est mise à jour (filet non lu avec la date au-dessus).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 8. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-9
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 8
- ux — EXPERIENCE.md, notifications ; mockups/key-notifications-mobile.html

## Notes

- Waits on epic-typographie-formes because: échelle typographique.
