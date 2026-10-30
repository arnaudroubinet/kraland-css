---
id: 18
type: bug
title: "Sur mobile, le toucher qui ferme le menu de personnage du kramail ouvre aussi le message dessous"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P2
---

# Sur mobile, le toucher qui ferme le menu de personnage du kramail ouvre aussi le message dessous

## Description

Sur les listes du kramail (Réception, Envoi, Corbeille) en mobile, chaque ligne est entièrement touchable : le titre du message est un lien étiré sur toute la ligne. Quand le menu de personnage de l'en-tête est ouvert, toucher une ligne pour le refermer ferme le menu et ouvre aussi le message touché. Le joueur quitte la liste sans l'avoir voulu.

Source : `revue-manuelle.md`, section « Ticket 7.4 — listes Réception, Envoi et Corbeille », point « Mobile : quand le menu de personnage est ouvert, toucher une ligne pour le fermer ouvre aussi le message » ; tri du 2026-10-30 (« tickets backlog à créer »). Recommandation suivie : absorber ce premier toucher. Le test `kramail-theme#entete-menu` contourne aujourd'hui le défaut en cliquant sur le titre du panneau (même section, point `kramail-theme#entete-menu`).

## Reproduction

1. Fixture `tests/e2e/fixtures/kramail-reception.html`, viewport 375×667, mode mobile.
2. Toucher le sélecteur de personnage (`#col-right h1.page-header .kramail-character-selector`) : le menu `.kramail-character-dropdown` s'ouvre.
3. Toucher une ligne de message hors du menu, par exemple en (5, 400) comme relevé au 7.4.
4. Constaté : le menu se ferme et la navigation vers le message part.
5. Attendu : le menu se ferme, aucune navigation, la liste reste affichée.

## Cause Hypothesis

`kraland-userscript-template.js:5844-5846` ferme le menu sur un `click` du document sans annuler ce clic : `document.addEventListener('click', e => { if (!selector.contains(e.target)) {setOpen(false);} });`. Le clic atteint donc le lien étiré `span[id^="ajax-m"] > a:last-child::after` (`kraland-theme.css:14152`, `position: absolute; inset: 0`). Le menu étant un composant du script et non un dropdown Bootstrap, aucun `.dropdown-backdrop` n'absorbe le toucher.

## Acceptance Criteria

1. **Premier toucher absorbé sur mobile**
   **Given** `kramail-reception` à 375×667, en Kraland clair et en Empire Brun sombre, menu de personnage ouvert
   **When** on touche une ligne de message hors du menu
   **Then** le menu est fermé, aucune navigation n'est demandée (URL inchangée, aucune requête de document) et la ligne n'est pas cochée
2. **Toucher suivant normal**
   **Given** le menu refermé par ce premier toucher
   **When** on touche à nouveau la même ligne
   **Then** le message s'ouvre (navigation vers son `href`)
3. **Options du menu inchangées**
   **Given** le menu ouvert à 375 px
   **When** on touche une option `.kramail-character-option`
   **Then** son lien est suivi, comme à la base
4. **Seuils et bureau**
   **Given** les largeurs 767 et 768 px, puis 1280×720
   **When** on rejoue le parcours
   **Then** à 767 px le premier toucher est absorbé ; à 768 et 1280 px le comportement est celui de la base, et `kramail-theme#entete-menu` reste vert, avec son clic extérieur ramené sur une ligne en mobile

## Notes

- Assumption : l'absorption ne concerne que le clic qui ferme le menu (par exemple `preventDefault` + `stopPropagation` en phase de capture tant que le menu est ouvert), et seulement en mode mobile ; le choix du mécanisme revient au plan.
- Assumption : Envoi et Corbeille partagent le même module ; un seul contrôle sur Réception suffit si le plan le justifie.
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : ticket créé, recommandation « absorber ce premier toucher » retenue.
