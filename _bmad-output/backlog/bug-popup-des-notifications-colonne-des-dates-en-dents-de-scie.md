---
id: 15
type: bug
title: "Popup des notifications : colonne des dates en dents de scie"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Popup des notifications : colonne des dates en dents de scie

## Description

Dans le popup 900×800 de `/report` (rendu ordinateur), la date d'une ligne non lue commence à 12 px du bord, celle d'une ligne lue à 5 px. La colonne des dates n'est donc pas alignée : elle avance et recule d'une ligne à l'autre. Les dates lues et non lues doivent commencer au même bord. Le défaut touche tout le rendu ordinateur (≥ 768 px), pas seulement le popup. Constaté au ticket 8.5.

## Reproduction

1. Fixture `report-non-lu.html` (servie à `/report/perso-000000`), vrai Bootstrap 3.3.7, bundle construit depuis 49d31df.
2. Fenêtre de 900×800, Kraland clair ou Empire Brun sombre.
3. Mesurer le bord gauche du texte de la date (première cellule) de chaque ligne.
4. Constaté : 12 px sur les lignes non lues (`tr.bg-info`), 5 px sur les lignes lues.
5. Attendu : un seul bord pour toutes les dates. Sans la peau, toutes les dates sont à 5 px.
6. À 375 px, toutes les dates sont à 12 px : le mobile n'a pas le défaut.

## Cause Hypothesis

Sur ordinateur, la règle de la cellule de date non lue (ticket 8.1) ajoute un retrait de `--kr-space-3` (12 px) pour dégager le texte du filet de 4 px. Les cellules de date lues gardent le retrait natif de Bootstrap (5 px). Le retrait ne s'applique qu'à une partie de la colonne.

## Acceptance Criteria

1. **Dates alignées sur ordinateur**
   **Given** la fixture `report-non-lu` avec des lignes lues et non lues
   **When** elle est rendue à 768, 900 et 1280 px, en Kraland clair et en Empire Brun sombre
   **Then** le texte de la date commence au même bord gauche sur toutes les lignes, et le texte d'une date non lue ne touche pas le filet
2. **Marque du non-lu inchangée**
   **Given** les mêmes rendus
   **When** une ligne non lue est mesurée
   **Then** elle garde le filet de 4 px de `--kr-status-unread` et la teinte à 14 % sur la cellule de date, et la colonne de date native de 100 px
3. **Mobile inchangé**
   **Given** la fixture à 375 et 767 px
   **When** elle est rendue
   **Then** la position des dates et du texte est celle d'avant le correctif
4. **Tests couvrent le cas**
   **Given** la suite `report-non-lu`
   **When** elle tourne
   **Then** un contrôle d'alignement des dates lues et non lues à 768, 900 et 1280 px passe sur le correctif et échoue sur le bundle de 2bdc8e1 (contre-épreuve par `KR_SCRIPT`)
5. **Ou : aucun changement nécessaire, avec preuve**
   **Given** la reproduction
   **When** elle est rejouée sur le code courant
   **Then** les dates sont déjà alignées, avec la mesure notée dans Notes — ce critère remplace 1 à 4

## Boundaries

- Must not change : couleur et graisse de la date, taille des dates (13 px) et du texte (14 px), texte de la 2e cellule, rendu mobile de `/report` (date au-dessus, filet sur la ligne entière).
- Seuils : vérifier 767, 768 et 769 px, et la bascule dans les deux sens dans le même onglet.

## References

- parent — none
- revue — _bmad-output/initiative-harmonisation-ux/revue-manuelle.md, section « Ticket 8.5 — captures des notifications (2026-10-29) », défaut « Dates mal alignées dans le popup »
- design — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md, composant « Ligne de notification »
- epic — _bmad-output/initiative-harmonisation-ux/epic-notifications/epic-notifications.md

## Notes

- Captures et mesures hors dépôt : `/Users/arnaud/kraland-css-captures/8.5/` (`popup-900x800-notifications-kraland.png`, `popup-900x800-notifications-empire-brun-dark.png`, `mesures.txt` : lignes « peau 900 » et « native 900 », champ `dates[].date.left`).
- Assumption: le bord commun est 12 px, le retrait voulu par 8.1 après le filet, étendu aux dates lues. Alternative : un autre bord commun, tant que le texte non lu ne touche pas le filet.
- Assumption: severity P3 (cosmétique, lecture intacte) et risk low (une règle ordinateur propre à `/report`).
- Open question: sur ordinateur, le texte (14 px) est 1 px plus bas que la date (13 px), lignes lues et non lues (`texteTop` contre `date.top` dans `mesures.txt`). À traiter ici ou à laisser ? À trancher au plan.
- Decision: bord commun des dates à 12 px (`--kr-space-3`), lignes lues comme non lues, à toute largeur ≥ 768 px (orchestrateur, 2026-10-29).
- Decision: le décalage vertical de 1 px du texte par rapport à la date est corrigé ici s'il vient de la même règle que le retrait ; sinon, il est consigné (orchestrateur, 2026-10-29).
- Decision: filet et teinte du non lu inchangés ; rendu mobile strictement inchangé (orchestrateur, 2026-10-29).
