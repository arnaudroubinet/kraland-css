---
id: 1
type: story
title: "La carte de Cybermonde est centrée sur ordinateur et défile dans un cadre sur mobile"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: true
risk: medium
---

# La carte de Cybermonde est centrée sur ordinateur et défile dans un cadre sur mobile

## Description

Dans la fenêtre Cybermonde (`/map`, `/map/…`), la carte du monde et la carte d'une ville ou d'une province sont aujourd'hui collées à gauche sur ordinateur et débordent de l'écran sur mobile. Sur ordinateur, elles sont centrées. Sur mobile, elles gardent leur taille réelle dans un cadre pleine largeur qui défile au doigt, et la page ne déborde plus. Étape humaine (`hitl`) : la validation visuelle d'Arnaud sur le site réel.

## Acceptance Criteria

1. **Carte centrée sur ordinateur**
   **Given** la fenêtre Cybermonde à 768, 769, 1280, 1440 et 1920 px, carte du monde puis carte d'une ville
   **When** la page est affichée
   **Then** les marges gauche et droite de la carte dans son conteneur diffèrent d'au plus 2 px
   **And** la largeur affichée de la carte est sa largeur naturelle (625 px pour la carte du monde, 1017 px pour une région)
   **And** le document ne défile pas horizontalement, sauf pour une région plus large que la fenêtre (768 à 1016 px) : elle reste à taille réelle et la page défile en largeur
2. **Cadre défilant sur mobile**
   **Given** la fenêtre Cybermonde à 320, 375 et 767 px, carte du monde (625 × 530) puis carte d'une ville
   **When** la page est affichée
   **Then** le document ne défile pas horizontalement (largeur de défilement égale à la largeur de l'écran)
   **And** la carte est dans un cadre pleine largeur qui défile horizontalement, sa largeur affichée égale à sa largeur naturelle
   **And** à l'ouverture, la position de défilement du cadre vaut (largeur défilable − largeur visible) / 2, à 1 px près
3. **Zones cliquables intactes**
   **Given** la carte du monde et ses 25 zones de province, et les liens de la carte d'une ville (flèches de sortie, bâtiments)
   **When** le joueur touche ou clique une zone ou un lien, sur mobile après défilement du cadre comme sur ordinateur
   **Then** la destination ouverte est celle de l'élément touché, comme sur le site natif
4. **Sélecteurs visibles sur mobile**
   **Given** la carte du monde à 320, 375 et 767 px
   **When** la page est affichée
   **Then** la carte commence sous les sélecteurs Province et Ville : aucun sélecteur n'est recouvert, et aucun grand vide ne les sépare de la carte
5. **Rien d'autre ne bouge**
   **Given** les panneaux de la page (Information, Fonctionnaires, Bâtiments…) et les sélecteurs Province, Ville, Travail, en Kraland clair et Empire Brun sombre
   **When** la page est affichée sur les deux supports
   **Then** leur rendu est celui d'avant le ticket, à leur position verticale près si la carte reprend sa place dans le flux

## Boundaries

- Must not change: les zones cliquables de la carte (forme, coordonnées, destinations), la taille de l'image de la carte, les panneaux et les sélecteurs de la page, les autres pages du jeu.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, Constraints (supports ordinateur et mobile)
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md, Pages secondaires (Carte), contexte seulement : centrage et cadre défilant ne vivent que dans les décisions ci-dessous
- constat — .tmp/captures/validation-1-6-cybermonde/ (hors git), captures du 2026-10-21

## Notes

- Decision: sur mobile, cadre défilant à taille réelle, et non carte réduite à la largeur ni aperçu avec plein écran (Arnaud, 2026-10-21).
- Decision: sur ordinateur, la carte est centrée (Arnaud, 2026-10-21).
- Decision: sur mobile, la carte du monde ne recouvre plus le sélecteur Ville, défaut natif corrigé dans ce ticket (Arnaud, 2026-10-21).
- Decision: entre 768 et 1016 px, une carte de région plus large que la fenêtre reste à taille réelle et la page défile en largeur, sans cadre (Arnaud, 2026-10-21).
- Constat du 2026-10-21 (site réel) : la carte du monde (`map2.png`, 625 × 530, 25 zones polygonales en pixels de l'image) est en position absolue à 200 px du bord gauche ; sur mobile, la page fait 825 px de large pour 375 px d'écran. Correction du 2026-10-21 : la carte d'une province ou d'une ville est faite de tuiles (`div#cX-Y`, 54 × 54) et d'une image transparente à zones (1017 × 549, 545 zones) dans une boîte de 678 px de large qu'elles débordent ; elle est collée à gauche sur ordinateur et fait 1017 px de document sur mobile.
- Assumption: le titre de la ville à 16 px du bord sur mobile (H10.1) reste à l'épopée 9.
- Assumption: le cadre mobile n'ajoute ni bordure ni fond ; la carte garde son cadre natif. Aucune règle de couleur, donc pas de vérification des 16 variantes.
- Open question: la carte du monde, en position absolue, réserve-t-elle sa place dans le flux ? À relever au début du travail ; un décalage vertical des panneaux est admis (critère 4).
- Fixtures à créer : carte du monde avec une `<map>` de 25 zones et carte de ville avec ses liens ; `tests/e2e/fixtures/cybermonde-ville.html` n'a pas d'image de carte.
