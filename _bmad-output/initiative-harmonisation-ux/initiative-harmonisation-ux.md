---
type: initiative
title: Harmonisation UX
parent: none
covers: [CAP-1, CAP-2, CAP-3, CAP-4, CAP-5, CAP-6, CAP-7, CAP-8, CAP-9, CAP-10]
after: []
assignee: ""
risk: high
---

# Harmonisation UX

## Description

La surcharge présente le même élément de la même façon sur toutes les pages, sert la boucle de jeu et se lit dans les 16 variantes. La spec `spec-harmonisation` porte les capacités, les contraintes et les non-goals ; cette initiative les livre en neuf épopées, une par lot de `lots-de-livraison.md`.

## Outcome

Arnaud joue sur ordinateur et sur téléphone une surcharge cohérente ; le signal est le Success signal de la spec.

## Done when

1. Les dix capacités sont livrées sur `feature/next`, chacune avec au moins un test par décision dans `npm run test:all`.
2. Arnaud joue les quatre parcours clés d'EXPERIENCE.md en Kraland clair et Empire Brun sombre sans élément qui change d'aspect ou de place d'une page à l'autre.
3. Texte coloré et texte posé sur la couleur de nation ≥ 4,5:1 dans les 16 variantes.
4. Aucune décision H, R ou Q tranchée de l'étude UX n'est laissée sans ticket.

## Boundaries

Une seule unité : la surcharge (`kraland-theme.css`, `kraland-userscript-template.js`, bundle généré, `tests/e2e`), un seul propriétaire. Hors périmètre : les Non-goals de la spec et les tickets 2 à 8 de `bmad/ux-lot8`. Pas de tracer entre épopées : chacune se livre seule sur la même surcharge.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, sections Capabilities et Constraints
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md, EXPERIENCE.md, notes-implementation.md

## Notes

- Decision: le code du lot 1 fait avec superpowers (`948d93f..5bf2984`) est la base ; le travail est réintégré dans BMad (Arnaud, 2026-10-20).
- Decision: neuf épopées, une par lot ; la modale d'ordre reste en deuxième, ses couleurs passant par `--kr-arm-bg` / `--kr-arm-ink` déjà définies pour chaque variante (Arnaud, 2026-10-20, après vérification du code).
- Decision: pas d'épopée de mise en place : build, lint et harnais Playwright existent ; P3 satisfait le 2026-10-20.
- Decision: livrer = PR fusionnée sur `feature/next` avec bundle et `version.json` régénérés (AGENTS.md › Livraison).
- Assumption: P1 est un ticket hitl de l'épopée 1 (note d'options écrite après le lot 1) ; P2 est le premier ticket hitl de l'épopée 2, qui en a besoin la première.
- Assumption: l'épopée 7 passe après la 6 (« ••• » commun posé par la 6, « Envoyer » du forum laissé à la 7) ; l'épopée 9 passe en dernier (marge de 16 px et cibles de 44 px touchent forum, kramail et notifications).
- Assumption: l'utilitaire de vérification des 16 variantes appartient à l'épopée 3.
- Waits on: voir `tickets.toml`.
