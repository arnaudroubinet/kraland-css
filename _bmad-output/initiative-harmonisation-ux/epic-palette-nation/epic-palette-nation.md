---
type: epic
title: "Couleurs de nation et contrastes"
parent: initiative-harmonisation-ux
covers: [CAP-4]
after: []
assignee: ""
risk: high
---

# Couleurs de nation et contrastes

## Description

Dans les 16 variantes, les couleurs viennent de la nation, une couleur vive signale un état, tout texte coloré se lit. Livre aussi l'utilitaire de vérification des 16 variantes et le jeton « non lu » que l'épopée 5 applique.

## Outcome

Une nation garde sa couleur partout et rien n'est illisible ; intent de CAP-4.

## Done when

1. Les critères success de CAP-4 tiennent, contrastes vérifiés par l'utilitaire dans les 16 variantes.
2. Les règles `:focus` propres à la modale (onglets, champ de texte) prennent l'anneau commun.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 3. Valeurs : DESIGN.md › Colors › Valeurs par variante. Applique la couleur « non lu » au jeton ; cloche et enveloppe restent à l'épopée 5. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-4
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 3
- ux — DESIGN.md, Colors (Rôles, Dériver une variante, Palette d'états, Jauges, Valeurs par variante, Contrastes de référence)
- constraint — spec, Constraints (P1)

## Notes

- Waits on epic-identite-et-defauts because: la stratégie de cascade (P1) décide comment battre les sections sans garde.
- Open question: Q3, Q4, Q21, Q26 (EXPERIENCE.md) à trancher au plan.
