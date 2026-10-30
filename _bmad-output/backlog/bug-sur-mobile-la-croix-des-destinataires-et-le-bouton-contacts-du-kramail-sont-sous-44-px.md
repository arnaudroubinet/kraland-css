---
id: 21
type: bug
title: "Sur mobile, la croix des destinataires et le bouton Contacts du kramail sont sous 44 px"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, la croix des destinataires et le bouton Contacts du kramail sont sous 44 px

## Description

Dans la rédaction du kramail sur mobile, deux `<button>` créés par le script restent sous la cible tactile de 44 px : la croix qui retire un destinataire (`kd-chip-x`, 34 × 32) et le bouton Contacts (`kd-contacts`, 105 × 40). Le ticket 9.9 les a laissés hors périmètre au nom de l'épopée 4, qui ne les a pas livrés ; personne ne les porte.

Source : `revue-manuelle.md`, section « Ticket 9.9 — Kramail mobile : marge de 16 px et cibles de 44 px » (point « Hors périmètre ») et rétro 9 (point A3 « `<button>` mobiles sous 44 px ») ; `deferred-work.md`, D9.5 ; tri du 2026-10-30 (« tickets backlog à créer »).

## Reproduction

1. Fixture `tests/e2e/fixtures/kramail-nouveau.html` (ou `kramail-repondre.html` pour avoir un destinataire déjà posé), viewport 375×667, mode mobile.
2. Ajouter un destinataire si besoin, puis mesurer `form[name="post_msg"] .kd-chip-x` et `.kd-contacts`.
3. Relevé du 9.9 : `kd-chip-x` 34 × 32, `kd-contacts` 105 × 40.
4. Attendu : chaque bouton offre une cible d'au moins 44 × 44 px atteinte par `elementFromPoint`.

## Cause Hypothesis

Tailles posées en dur dans le bloc mobile (`@media (max-width: 767px)`, `kraland-theme.css:10571`) :

- `kraland-theme.css:10624-10629` : `.kd-chip-x { width: 34px; min-width: 0 !important; min-height: 0 !important; height: 32px; }` neutralise le plancher tactile générique.
- `kraland-theme.css:10646-10652` : `.kd-contacts { position: absolute; top: -42px; right: 0; height: 40px; min-height: 0 !important; }`.

Les boutons sont créés par `kraland-userscript-template.js:6457` (`kd-contacts`) et `:6597` (`kd-chip-x`).

## Acceptance Criteria

1. **Cibles de 44 px**
   **Given** `kramail-nouveau` et `kramail-repondre` à 375×667 et à 320×568, en Kraland clair et en Empire Brun sombre, au moins un destinataire posé
   **When** on mesure la zone touchable de chaque `.kd-chip-x` et de `.kd-contacts`
   **Then** elle fait au moins 44 × 44 px, et `elementFromPoint` en son centre et à 2 px de chaque bord renvoie le bouton (ou un descendant)
2. **Pas de recouvrement**
   **Given** les mêmes pages
   **Then** `.kd-contacts` ne recouvre ni le titre, ni le champ des destinataires, ni un autre bouton ; la croix d'un destinataire ne recouvre pas le destinataire voisin
3. **Comportement inchangé**
   **Given** un destinataire posé
   **When** on touche sa croix, puis le bouton Contacts
   **Then** le destinataire est retiré, puis le panneau des contacts s'ouvre, comme à la base (aucun envoi du formulaire)
4. **Seuils et bureau**
   **Given** les largeurs 767 et 768 px, et 1280×720
   **Then** à 767 px les critères 1 et 2 tiennent ; à 768 et 1280 px le rendu est celui de la base

## Notes

- Assumption : la cible peut grandir sans grossir le glyphe (zone touchable étendue, par exemple par padding ou pseudo-élément) ; le choix revient au plan.
- Assumption : `.kd-contacts` est placé en absolu à `top: -42px` ; passer à 44 px peut demander de revoir ce placement. Non mesuré.
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : nouveau ticket plutôt que « tels quels » (A3 de la rétro 9).
- Relevé connecté du 2026-10-30, page Signaler à 375 : loupe 34×32 et bouton Contacts 105×40, sous 44 px ; à inclure. Plateau, panneau Bâtiment : bouton maison 34×44 (même famille, à inclure si le correctif est commun).
