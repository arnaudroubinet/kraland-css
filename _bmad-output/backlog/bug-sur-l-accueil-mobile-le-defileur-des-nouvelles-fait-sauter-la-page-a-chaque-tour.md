---
id: 25
type: bug
title: "Sur l'accueil mobile, le défileur des Nouvelles fait sauter la page à chaque tour"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P2
---

# Sur l'accueil mobile, le défileur des Nouvelles fait sauter la page à chaque tour

## Description

Le ticket 10.6 a plafonné `ul.demo` à la nouvelle visible (`max-height: max-content`, `kraland-theme.css:11824`). Le défileur natif fait tourner les nouvelles : à chaque tour, la hauteur de la liste s'effondre un instant, puis prend celle de la nouvelle suivante. Tout ce qui est dessous saute. Risque signalé par la revue du 10.6, confirmé sur le vrai site le 2026-10-30.

## Reproduction

1. Vrai `/accueil` déconnecté, 375×667, bundle 1.0.1793348337346 (HEAD 1e4de5c).
2. Relever la hauteur de `ul.demo` et la position du pied toutes les 500 ms pendant 42 s (10 tours).
3. Constaté : `ul.demo` varie de 1,2 à 67,6 px ; le pied saute entre y=942 et y=1008 (jusqu'à 66 px) ; ±8 px entre deux nouvelles.
4. Attendu : hauteur de la carte Nouvelles et position du pied constantes pendant les tours.
5. Mesures : `/Users/arnaud/kraland-css-captures/verif-2026-10-30/reel/defileur.json`, `/Users/arnaud/kraland-css-captures/verif-2026-10-30/reel/reel.log`.

## Cause Hypothesis

`max-height: max-content` suit la hauteur instantanée de la liste pendant l'animation native (repli de la nouvelle sortante). La hauteur en ligne posée par le site (`height: 95px` relevé à 320 px) n'est plus le plancher.

## Acceptance Criteria

1. **Pas de saut**
   **Given** l'accueil mobile (375 et 320 px), défileur actif
   **When** le défileur fait au moins 3 tours (horloge simulée ou animation rejouée sur fixture)
   **Then** la hauteur de la carte Nouvelles et la position du pied varient de 0 px
2. **Pas de grand vide**
   **Then** l'espace sous la nouvelle la plus haute reste ≤ 8 px
3. **Ordinateur inchangé**
   **Given** l'accueil à 1280 px **Then** rendu identique à la base

## Notes

- Relevé connecté du 2026-10-30 à 375 : **non reproduit** (pied stable à 1 px sur 60 relevés en 30 s). Le saut n'est mesuré qu'en déconnecté. Commencer par comprendre la différence (nombre ou hauteur des nouvelles, structure du bloc) avant de corriger.

- Assumption : hauteur fixe égale à la nouvelle la plus haute (mesurée par le script, ou `min-height` calé sur la plus haute) ; le repli d'une seule nouvelle prévu par la revue (`min-height` = hauteur d'une nouvelle) ne suffit pas, les nouvelles diffèrent de ±8 px.
- La fixture `accueil.html` doit rejouer le défileur natif (la suite actuelle ne l'anime pas). Piège : `page.clock` casse `requestAnimationFrame`.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
