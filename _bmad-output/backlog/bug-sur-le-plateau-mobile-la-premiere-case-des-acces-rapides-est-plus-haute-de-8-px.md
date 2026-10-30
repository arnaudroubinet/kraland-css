---
id: 20
type: bug
title: "Sur le plateau mobile, la première case des accès rapides est plus haute de 8 px"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur le plateau mobile, la première case des accès rapides est plus haute de 8 px

## Description

Sur le plateau mobile, la grille des accès rapides (`.kr-quick-access-buttons`) a deux colonnes de cases de 44 px. La première case (Agir) mesure 152×52 au lieu de 152×44 : elle est décalée de 8 px par rapport à sa voisine.

Source : `deferred-work.md`, D9.3 (reports du ticket 9.11, statut « proposé ») ; tri du 2026-10-30 de `revue-manuelle.md` (« tickets backlog à créer »).

## Reproduction

Mesures de D9.3 :

1. Fixture `tests/e2e/fixtures/plateau-qualite-usage.html`, viewport 375×667, mode mobile.
2. Mesurer les cases de `.kr-quick-access-buttons > .btn` : Agir en y 344, Matériel en y 352 ; Agir 152×52, les autres 152×44.
3. Déplacer l'actif sur Matériel : Agir reste à 52 px (l'état actif n'y est pour rien).
4. Attendu : toutes les cases à la même hauteur et alignées par rangée.

## Cause Hypothesis

`kraland-theme.css:4885-4886`, dans `@media (max-width: 767px)` (l.4272) : `.btn + .btn:where(:not([data-kr-dossier])) { margin-top: 8px !important; }` bat le `margin: 0` sans `!important` de la grille (`kraland-theme.css:12529`, `.kr-action-grid > .btn, .kr-quick-access-buttons > .btn`). Seule la première case échappe au sélecteur `.btn + .btn` ; les suivantes reçoivent 8 px de marge haute, ce qui étire la rangée et la première case. D9.3 situait la grille à l.12569 ; elle est aujourd'hui à l.12529. Le gras et le filet de l'actif réservés au bureau (`@media (min-width: 768px)`, l.12452 et l.12498) sont voulus.

## Acceptance Criteria

1. **Cases égales**
   **Given** `plateau-qualite-usage` à 375×667, en Kraland clair et en Empire Brun sombre
   **When** on mesure chaque `.kr-quick-access-buttons > .btn` et chaque `.kr-action-grid > .btn`
   **Then** toutes ont la même hauteur (≥ 44 px), et les deux cases d'une rangée ont le même `top`
2. **Espacement ailleurs inchangé**
   **Given** une page mobile avec deux `.btn` voisins hors de ces grilles
   **Then** leur marge haute de 8 px est celle de la base
3. **Seuils**
   **Given** les largeurs 767 et 768 px, et la bascule 767, 768, 767 dans le même onglet
   **Then** à 767 px le critère 1 tient ; à 768 px le rendu des accès rapides est celui de la base

## Notes

- Assumption : D9.3 note que les boutons sont masqués sur `jeu-materiel` ; leur présence sur le vrai plateau mobile reste à vérifier, sans bloquer le correctif sur fixture.
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : D9.3 devient un ticket.
