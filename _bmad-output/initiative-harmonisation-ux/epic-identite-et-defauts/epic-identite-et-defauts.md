---
type: epic
title: "Identité du personnage et pages sans décor emprunté"
parent: initiative-harmonisation-ux
covers: [CAP-1, CAP-2]
after: []
assignee: ""
risk: medium
---

# Identité du personnage et pages sans décor emprunté

## Description

Sur toutes les pages de jeu, le joueur voit le nom du personnage joué et sa section ; hors de leurs pages, ni le décor des listes du forum ni la barre fixe d'envoi n'apparaissent. Le code du lot 1 est construit sur `feature/next` (`948d93f..5bf2984`) ; restent la correction de Cybermonde et la note d'options de cascade (P1).

## Outcome

Le joueur sait qui il joue et où il est, sur des pages sans texte parasite ; intents de CAP-1 et CAP-2.

## Requirements

Source numérotée : spec-harmonisation.md, CAP-1 et CAP-2 (critères success), plus l'accord du 2026-10-16 sur Cybermonde et Personnage.

## Done when

1. Les critères success de CAP-1 et CAP-2 tiennent sur fixtures, Cybermonde (`/map`) compris : aucun bloc de compteurs ni cellule masquée.
2. La note d'options de cascade est écrite et Arnaud a tranché P1.
3. Livré sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 1. Ne touche ni la palette (épopée 3) ni les cartes de section (épopée 5) ; la barre fixe du kramail reste jusqu'à l'épopée 7. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-1, CAP-2
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 1
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md, Component Patterns (Mini-profil, Panneau latéral, Boutons d'accès rapide, Onglets de section)
- accord — `bmad/ux-lot8:_bmad-output/backlog/bug-forum-mobile-hors-forums.md` (Cybermonde et Personnage, 2026-10-16)

## Notes

- Decision: garde H1.1 `:where(.page-forum, .page-forum-racine)` retenue, pas la classe `kr-no-forum-tables` du ticket 1 de `bmad/ux-lot8` (Arnaud, 2026-10-20).
- Decision: Événements, Membres, Contacts et Statistiques ne sont pas touchés par le lot 1 (visite réelle du 2026-10-20).
- Assumption: P1 est un ticket hitl de cette épopée, écrit après le lot 1.
- Decision: les entrées 1 à 5, commitées directement sur `feature/next`, y restent : pas de branche de lot ni de PR pour elles (Arnaud, 2026-10-20). Le mode de livraison des entrées 6 à 8 reste à décider.
- Decision: entrées 1 à 5 inscrites `built` à la demande d'Arnaud ; « done » attend la revue indépendante (`bmad-code-review`) et son accord (2026-10-20).
- Decision: balle traçante = entrée 1 (déjà construite) ; l'entrée 6 précède la note P1, écrite après le lot 1.
- Decision: Refactor sweep proposé par défaut (entrée 8).
- Unknown: autres pages hors forum où le module des sujets permanents agit encore ; l'entrée 6 les cherche.
