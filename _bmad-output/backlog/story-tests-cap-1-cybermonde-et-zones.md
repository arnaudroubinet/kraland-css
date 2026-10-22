---
id: 4
type: story
title: "Les tests de CAP-1 couvrent le décor CSS sur Cybermonde, « messages » et les bonnes zones"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
---

# Les tests de CAP-1 couvrent le décor CSS sur Cybermonde, « messages » et les bonnes zones

## Description

La suite `jeu-identite` vérifie l'absence du décor du forum sur Personnage, mais pas sur Cybermonde, et son motif de détection ignore le mot « messages ». Elle n'est pas non plus relancée quand le module des sujets permanents ou Cybermonde change. Après ce ticket, ces trois trous sont fermés, sans changer le code de la surcharge.

## Acceptance Criteria

1. **Décor CSS mesuré sur Cybermonde**
   **Given** la fixture Cybermonde à 320 et 375 px
   **When** la suite tourne
   **Then** aucun pseudo-élément de ses tableaux ne produit « sujets », « messages » ni « → »
2. **« messages » détecté partout**
   **Given** les contrôles de fuite du décor (Personnage, Cybermonde)
   **When** une cellule reçoit « messages » par pseudo-élément
   **Then** le contrôle échoue (contre-épreuve sur une règle injectée)
3. **Zones de test**
   **Given** une modification de la section du module des sujets permanents ou de Cybermonde
   **When** `npm run test:changed` choisit les suites
   **Then** la suite `jeu-identite` en fait partie (les zones sont portées par la suite entière, pas par un fragment), et `npm run test:router` passe

## Boundaries

- Must not change: `kraland-theme.css`, le template et le bundle ; les autres fragments de la suite.

## References

- parent — none
- retro — _bmad-output/initiative-harmonisation-ux/epic-identite-et-defauts/epic-identite-et-defauts-retrospective.md, Action items 3
- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-1
