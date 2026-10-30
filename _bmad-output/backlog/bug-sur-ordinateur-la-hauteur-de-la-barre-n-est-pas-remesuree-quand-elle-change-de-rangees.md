---
id: 32
type: bug
title: "Sur ordinateur, la hauteur de la barre n'est pas remesurée quand elle change de nombre de rangées"
parent: none
covers: []
after: [31]
assignee: ""
refined: true
hitl: false
risk: medium
severity: P3
---

# Sur ordinateur, la hauteur de la barre n'est pas remesurée quand elle change de nombre de rangées

## Description

Entre 992 et 1359 px, la barre de navigation passe sur 2 ou 3 rangées. `applyNavbarPadding` mesure sa hauteur une fois au chargement (rAF + 200 ms), puis seulement au redimensionnement. Si le contenu de la barre change après cette mesure (polices, icônes, menus ajoutés), le `padding-top` du corps reste faux. Hypothèse issue du ticket backlog 22 (2026-10-30), non confirmée.

## Reproduction

1. Ordinateur, 1440 px, empire-brun-dark, accueil : `accueil-mobile#bureau` a mesuré « Nouvelles » à 161 au lieu de 211 sur la base `e2bcdd1` (barre comptée sur 2 rangées au lieu de 3).
2. `breakpoint-switch#nav-large` et `#nav-origine` : barre mesurée à 60 au lieu de 120 px à 1100 px (2 sur 41 tours), même cause possible.
3. Attendu : `padding-top` égal à la hauteur réelle de la barre une fois la page stable.

## Cause Hypothesis

`kraland-userscript-template.js` ~l.890 : une seule mesure au chargement. Aucun suivi des changements de taille de la barre (par exemple `ResizeObserver` sur `nav.navbar`).

## Acceptance Criteria

1. **Barre qui grandit après la mesure**
   **Given** une barre qui passe de 2 à 3 rangées après le chargement, sans redimensionnement
   **Then** le haut du contenu suit la nouvelle hauteur
2. **Mobile inchangé**
   **Given** une largeur < 992 px ou le mode mobile
   **Then** aucun `padding-top` en ligne n'est posé
3. **Pas de boucle**
   **Given** la remesure modifie `max-height` de la barre
   **Then** aucune remesure en boucle (nombre d'appels borné)

## Notes

- Open question : confirmer d'abord la cause par une fixture où la barre change de rangées après le chargement ; si elle ne reproduit pas, clore en spike.
- Après 31 : même famille (mesure unique au démarrage), même méthode de test.
