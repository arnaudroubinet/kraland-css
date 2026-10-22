---
id: 2
type: story
title: "L'onglet de section actif sur mobile suit la même règle que l'ordinateur"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
---

# L'onglet de section actif sur mobile suit la même règle que l'ordinateur

## Description

Sur ordinateur, la section en cours se reconnaît par l'URL exacte de la section ou l'un de ses sous-chemins (`/jouer/plateau/…`). Sur mobile, la barre d'onglets marque l'onglet actif dès que l'URL contient le chemin de la section, une règle différente. Les deux supports marquent la même section sur les mêmes pages, et l'onglet actif mobile est vérifié par un test.

## Acceptance Criteria

1. **Même section active sur les deux supports**
   **Given** les pages `/jouer/plateau`, `/jouer/plateau/<pièce>`, `/jouer/perso` et une page hors jeu (`/forum/rp`)
   **When** elles s'affichent à 375 px puis à 1280 px
   **Then** l'onglet mobile actif (`li.active`, seul onglet portant `aria-selected="true"`) et l'accès rapide actif d'ordinateur désignent la même section (Agir, Agir, Personnage)
   **And** hors jeu, aucun accès rapide n'est actif (la barre d'onglets mobile n'existe que sur `/jouer/…`)
2. **Chemin voisin non confondu**
   **Given** une URL qui commence comme une section sans en être un sous-chemin (par exemple `/jouer/plateaux`)
   **When** la page s'affiche sur mobile
   **Then** aucun onglet n'est actif
3. **Tests**
   **Given** la suite `jeu-identite`
   **When** elle tourne
   **Then** elle vérifie l'onglet mobile actif, et une contre-épreuve sur l'ancienne règle échoue

## Boundaries

- Must not change: les libellés, icônes et destinations des onglets et des accès rapides ; le style de l'onglet actif.

## References

- parent — none
- retro — _bmad-output/initiative-harmonisation-ux/epic-identite-et-defauts/epic-identite-et-defauts-retrospective.md, Action items 1
- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-2

## Notes

- Constat (rétrospective, 2026-10-21) : `krActiveGameSection` (égalité ou préfixe suivi de `/`) d'un côté, `includes` de l'autre ; écart déduit du code, aucun cas réel observé.
