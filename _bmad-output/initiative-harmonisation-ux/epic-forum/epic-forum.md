---
type: epic
title: "Forum : activité et repères"
parent: initiative-harmonisation-ux
covers: [CAP-7]
after: []
assignee: ""
risk: high
---

# Forum : activité et repères

## Description

Le joueur voit où les forums bougent, ouvre le dernier message en un geste, et chaque niveau du forum se présente pareil. Pose le bouton « ••• » commun, kramail compris.

## Outcome

Le tour des forums se fait depuis l'index ; intent de CAP-7.

## Done when

1. Les critères success de CAP-7 tiennent pour RP, HRP, Communauté et Débats, sur les deux supports.
2. Sur mobile, la flèche « dernier message » et « premier non lu » mènent au message (ancre `#msg…` conservée).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 6. La barre d'envoi du forum reste à l'épopée 7. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-7
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 6
- ux — EXPERIENCE.md, Ligne de forum, Fil d'Ariane, En-tête de sujet ; mockups/h12-index-forum.html
- faits — notes-implementation.md, Ancres sur mobile

## Notes

- Waits on epic-cartes-pastilles because: carte de section mobile.
- Open question: Q27, Q28 (EXPERIENCE.md) à trancher au plan.
