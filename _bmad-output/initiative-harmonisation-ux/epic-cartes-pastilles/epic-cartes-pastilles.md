---
type: epic
title: "Cartes de section et familles de pastilles"
parent: initiative-harmonisation-ux
covers: [CAP-6]
after: []
assignee: ""
risk: medium
---

# Cartes de section et familles de pastilles

## Description

Chaque section mobile se présente dans la même carte, et chaque pastille dit par sa famille si elle signale un état ou une catégorie.

## Outcome

Le joueur reconnaît une section et le sens d'une pastille d'un coup d'œil ; intent de CAP-6.

## Done when

1. Les critères success de CAP-6 tiennent sur le jeu, le forum, le sous-forum et le kramail.
2. La suite `sous-forum` est mise à jour pour R6 (fin de la pleine largeur).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 5. Applique la couleur « non lu » de l'épopée 3 à la cloche et à l'enveloppe. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-6
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 5
- ux — DESIGN.md, Components (Carte de section, Étiquette de catégorie, Pastille d'état) ; mockups/h04-entetes-section-mobile.html

## Notes

- Waits on epic-palette-nation because: couleurs d'état et « non lu ».
- Waits on epic-typographie-formes because: titres 17 px et rayons.
- Open question: Q10, Q30 (EXPERIENCE.md) à trancher au plan.
