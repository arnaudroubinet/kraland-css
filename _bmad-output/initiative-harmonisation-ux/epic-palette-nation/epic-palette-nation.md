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

Dans les 16 variantes, les couleurs viennent de la nation, une couleur vive signale un état, tout texte coloré se lit. Reprend l'utilitaire des 16 variantes créé par le ticket 2.3 et livre le jeton « non lu » que l'épopée 5 applique.

## Outcome

Une nation garde sa couleur partout et rien n'est illisible ; intent de CAP-4.

## Requirements

Source numérotée : spec-harmonisation.md, CAP-4 (critères success) ; décisions H5.1 à H5.7, Q1, Q2, R3 et R7 d'EXPERIENCE.md et DESIGN.md.

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
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md, State Patterns, Accessibility Floor
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md, Components
- faits — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/notes-implementation.md, Primaire en texte ; Texte posé aujourd'hui sur la primaire

## Notes

- Waits on epic-identite-et-defauts because: la stratégie de cascade (P1) décide comment battre les sections sans garde.
- Open question: Q3, Q4, Q21, Q26 (EXPERIENCE.md) à trancher au plan.
- Decision: balle traçante = entrée 1 ; entrées chaînées (suite palette-nation.mjs et blocs de variables partagés) (2026-10-23).
- Decision: l'entrée 1 est le seul déclarant de --kr-arm-ink-hover (Paladium clair) ; l'entrée 7 possède les règles :focus de la modale d'ordre ; le ticket 2.6 garde les fonds et le halo de l'onglet actif (prise en autonomie, 2026-10-23).
- Assumption: valeurs [ASSUMPTION] de DESIGN.md reprises telles quelles (formules H5.2, états et jauges Q3, info en sombre Q4) ; fonds et bordures des alertes à 12 % et 35 % (maquette) ; Q21 accepté (le libellé et la forme distinguent non-lu et danger) ; Q26 : text-secondary foncé à #636a77 en clair ; Q20 : pas de seuil non textuel pour les bordures décoratives ; texte aujourd'hui en primaire → text-accent ; Q16 : high-contrast hors des 16 variantes, inchangée ; .f4 à .f8 éclaircies jusqu'à 4,5:1 en sombre.
