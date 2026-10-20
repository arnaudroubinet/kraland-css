---
type: epic
title: "Plateau et confort mobile"
parent: initiative-harmonisation-ux
covers: [CAP-10]
after: []
assignee: ""
risk: medium
---

# Plateau et confort mobile

## Description

Le joueur voit visage et nom entier des personnages présents, touche la bonne cible du premier coup, ne lit aucun texte collé au bord. Dernière épopée : elle vérifie aussi le Success signal de la spec.

## Outcome

Plateau lisible sur portable et pages mobiles confortables ; intent de CAP-10 et Success signal de la spec.

## Done when

1. Les critères success de CAP-10 tiennent ; cartes de personnages vérifiées de 1100 à 1500 px.
2. Arnaud joue les quatre parcours clés en Kraland clair et Empire Brun sombre.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 9. Cibles hors boutons (les boutons sont à l'épopée 4) et marge latérale de toutes les pages. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-10
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 9
- ux — DESIGN.md, Carte de personnage, détail ; Layout & Spacing (marge mobile)
- faits — notes-implementation.md, Marges mobiles, Cartes de personnages

## Notes

- Waits on epic-identite-et-defauts because: P1.
- Waits on epic-typographie-formes because: tailles de bouton.
- Waits on epic-forum, epic-kramail-mobile, epic-notifications because: la marge et les cibles touchent leurs pages.
- Open question: Q7, Q20, Q24, Q29, Q32 (EXPERIENCE.md) à trancher au plan.
