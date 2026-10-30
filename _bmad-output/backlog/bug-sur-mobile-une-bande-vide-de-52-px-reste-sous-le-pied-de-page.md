---
id: 26
type: bug
title: "Sur mobile, une bande vide d'environ 52 px reste sous le pied de page"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, une bande vide d'environ 52 px reste sous le pied de page

## Description

Sur toutes les pages mobiles mesurées, une bande vide reste sous le pied de page en bas de défilement. Relevé par la vérification en émulation du 2026-10-30 (point 8).

## Reproduction

1. Fixtures du forum et du kramail (avec et sans barre d'outils), 375×667, bundle 1.0.1793348337346 (HEAD 1e4de5c).
2. Défiler jusqu'en bas.
3. Constaté : 52 px vides sous le pied.
4. Attendu : rien sous le pied, sauf la place réservée à un élément fixe réellement présent (barre d'envoi fixe, par exemple).
5. Captures : `/Users/arnaud/kraland-css-captures/verif-2026-10-30/shots/p8-{avec,sans}-*-bas.png`.

## Cause Hypothesis

`ensureFooterSticky` (`kraland-userscript-template.js:7822`) pose `margin-bottom: 60px` en ligne sur `body`, pour le pied collant de Bootstrap 3.3. Sur mobile, le pied n'est pas collant : la marge ne sert plus.

## Acceptance Criteria

1. **Pas de bande**
   **Given** les pages mobiles (forum, kramail, plateau, accueil), 375 et 767 px
   **When** on défile jusqu'en bas
   **Then** l'espace sous le pied est ≤ 8 px, sauf la place d'un élément fixe présent, qui ne couvre aucun contenu
2. **Ordinateur inchangé**
   **Given** les mêmes pages à 768 et 1280 px **Then** rendu identique à la base (pied collant compris)
3. **Bascule**
   **Given** 767 vers 768 puis 767 dans le même onglet **Then** les deux rendus sont corrects

## Notes

- Assumption : vérifier d'abord quelle règle CSS ou quel élément fixe compte sur ces 60 px (barre d'envoi, « Remonter en haut ») avant de retirer la marge sur mobile.
- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
