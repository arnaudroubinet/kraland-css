---
id: 28
type: bug
title: "À 768 et 992 px, les onglets des Contacts chevauchent la carte de 11 px"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# À 768 et 992 px, les onglets des Contacts chevauchent la carte de 11 px

## Description

Sur la page Contacts du kramail, les onglets de catégorie (Toutes, n°1…) chevauchent la carte Contacts de 11 px à deux largeurs de seuil. Relevé par la vérification en émulation du 2026-10-30 (point 4).

## Reproduction

1. Fixture Contacts du kramail, bundle 1.0.1793348337346 (HEAD 1e4de5c).
2. Mesurer le bas des onglets et le haut de la carte.
3. Constaté : 11 px de chevauchement à 768 et 992 px ; rien à 767, 900, 991 ni 1280.
4. Attendu : aucun chevauchement à toutes les largeurs de bureau.
5. Captures : `/Users/arnaud/kraland-css-captures/verif-2026-10-30/shots/p4-contacts-{767,768}.png`.

## Cause Hypothesis

Non localisée. Les deux largeurs sont des seuils de Bootstrap (`sm` 768, `md` 992) : une règle de largeur ou de marge négative propre à une plage s'applique au seuil exact, peut-être un média en `max-width: 991px` contre `min-width: 992px`, ou une règle native au seuil.

## Acceptance Criteria

1. **Pas de chevauchement**
   **Given** la page Contacts à 767, 768, 769, 991, 992, 993 et 1280 px, Kraland clair et Empire Brun sombre
   **Then** le bas des onglets est au-dessus du haut de la carte (écart ≥ 0)
2. **Rendu inchangé ailleurs**
   **Given** 900 et 1280 px **Then** rendu identique à la base

## Notes

- Relevé connecté du 2026-10-30 : **non reproduit sur le vrai site** (29 px d'écart entre onglets et carte à 768 et 992, vrai titre « Membres » court). Le chevauchement vient du titre long de la fixture. Assumption : rendre le titre robuste à un libellé long reste utile, priorité basse ; sinon, abandonner le ticket.

- Decision: 2026-10-30, orchestrateur, sur mandat « je vais suivre ta recommandation ».
