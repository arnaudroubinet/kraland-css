---
type: epic
title: "Modale d'ordre lisible et sûre"
parent: initiative-harmonisation-ux
covers: [CAP-3]
after: []
assignee: ""
risk: high
---

# Modale d'ordre lisible et sûre

## Description

Avant de valider un ordre, sur les deux supports, le joueur lit l'ordre choisi, son coût, sa durée, ses chances et tout blocage ou avertissement. Le premier ticket est P2 : vérifications sur un vrai téléphone, protocole fourni à Arnaud.

## Outcome

Le joueur ne valide plus un ordre impossible sans l'avoir vu ; intent de CAP-3.

## Requirements

Source numérotée : spec-harmonisation.md, CAP-3 (critères success) ; décisions H2.1 à H2.7, R2 et Q1 d'EXPERIENCE.md et DESIGN.md.

## Done when

1. Les critères success de CAP-3 tiennent sur une fixture synthétique de la modale, y compris après un changement d'ordre et un contenu chargé plus tard.
2. P2 fait sur un vrai téléphone, résultats consignés, avant la partie mobile.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 2. Les règles propres à la modale (`.bootbox-confirm`, en dur et en `!important`) sont réécrites ici avec `--kr-arm-bg` / `--kr-arm-ink` ; anneau de focus et taille de bouton restent aux épopées 3 et 4. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-3
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 2
- ux — EXPERIENCE.md, Modale d'ordre, détail ; DESIGN.md, Modale d'ordre, détail ; mockups/key-modale-ordre.html
- faits — notes-implementation.md, Modale d'ordre (critère des alertes, module à revoir)

## Notes

- Decision: reste en deuxième position ; les couleurs passent par la paire arm déjà définie pour chaque variante (Arnaud, 2026-10-20).
- Assumption: le travail ordinateur peut commencer avant P2.
- Decision: balle traçante = entrée 2 ; P2 reste en entrée 1 et ne bloque que l'entrée 6 (prise en autonomie le 2026-10-22, à confirmer : revue-manuelle.md).
- Decision: entrées 3 à 6 chaînées (elles partagent la suite modale-ordre, le bloc CSS `.bootbox-confirm` et la chaîne du module) (2026-10-22).
- Decision: commits sur `feature/next` comme pour le lot 1 ; push et PR soumis à Arnaud (revue-manuelle.md) (2026-10-22).
- Assumption: Q5 (pastilles) : style des étiquettes de catégorie, icône et valeur, 12 px gras ; Q25.2 : alertes sous le titre de l'ordre (h4) ; Q25.3 : aide repliée aussi sur ordinateur (maquette) ; Q25.4 : croix laissée à sa place native.
- Assumption: l'outil de vérification des 16 variantes est créé par l'entrée 3 (et non par l'épopée 3).
- Constat du 2026-10-22 (site réel, lecture seule, modales annulées) : structure native relevée hors dépôt dans `.tmp/captures/modale-ordre/squelettes.txt`.
- Decision: le repli de l'aide et les pastilles passent aux deux supports aux entrées 3 et 4 (règles corrigées), pas à l'entrée 2, pour ne pas étendre à l'ordinateur le repli de la première alerte (2026-10-22).
