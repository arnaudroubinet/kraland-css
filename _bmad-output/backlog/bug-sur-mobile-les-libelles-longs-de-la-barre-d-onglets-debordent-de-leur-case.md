---
id: 19
type: bug
title: "Sur mobile, les libellés longs de la barre d'onglets débordent de leur case"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: medium
severity: P3
---

# Sur mobile, les libellés longs de la barre d'onglets débordent de leur case

## Description

La barre d'onglets mobile (`.mobile-tab-bar`, créée par le script) répartit ses cinq onglets en cases égales de 75 px à 375 px. Les libellés Personnage, Bâtiments et Employés sont plus larges que leur case : les cibles se chevauchent et la barre fait 385 px pour un écran de 375.

Source : `deferred-work.md`, D9.2 (reports du ticket 9.11, parcours clés et captures de validation, statut « proposé ») ; tri du 2026-10-30 de `revue-manuelle.md` (« tickets backlog à créer »).

## Reproduction

Mesures de D9.2, à 375 px, deux variantes :

1. Fixtures du plateau (par exemple `tests/e2e/fixtures/plateau-qualite-usage.html`), viewport 375×667, mode mobile.
2. Mesurer la largeur de chaque `li` (75 px, `flex: 1 1 0`) et de chaque `a` : Personnage 96 px, Bâtiments 86 px, Employés 85 px, sur toutes les pages, actifs ou non (le demi-gras ajoute environ 4 px).
3. `elementFromPoint` au bord droit de Personnage et de Bâtiments renvoie l'onglet suivant.
4. Employés finit à x 384,7 ; sur la page personnage, la barre défile de 10 px et coupe Agir à x −10.
5. Attendu : chaque onglet tient dans sa case, la barre ne dépasse pas 375 px.

## Cause Hypothesis

D9.2 relève un `a` en `inline-flex` `nowrap` avec 16 + 16 px de padding. Piste : la règle mobile générique `.nav-tabs > li > a { padding: 12px 16px !important; font-size: 16px !important; }` (`kraland-theme.css:4914-4916`, dans `@media (max-width: 767px)` ouvert l.4272) bat le `padding: 8px 4px` sans `!important` de `.mobile-tab-bar.nav-tabs > li > a` (`kraland-theme.css:5613-5620`). Le libellé `.mobile-tab-label` (`kraland-theme.css:5637`) a bien `overflow: hidden` et `text-overflow: ellipsis`, mais le `a` lui-même ne rétrécit pas sous son contenu. À confirmer par mesure de la cascade calculée ; l'origine exacte de l'`inline-flex` n'est pas localisée.

## Acceptance Criteria

1. **Aucun débordement à 375 px**
   **Given** les pages du plateau (Agir, Matériel, Personnage, Bâtiments, Employés) à 375×667, en Kraland clair et en Empire Brun sombre, onglet actif ou non
   **When** on mesure chaque `.mobile-tab-bar > li > a`
   **Then** sa largeur est au plus celle de son `li`, la barre a un `scrollWidth` au plus égal à 375 px et ne défile pas
2. **Cibles distinctes**
   **Given** les mêmes pages
   **When** on lit `elementFromPoint` à 1 px du bord droit et du bord gauche de chaque onglet
   **Then** il renvoie cet onglet ; chaque onglet garde une hauteur ≥ 44 px
3. **Libellé lisible**
   **Given** le libellé le plus long (Personnage)
   **Then** il est entier ou tronqué par ellipse dans sa case, jamais sous la taille `--kr-font-label`
4. **Seuils**
   **Given** les largeurs 767 et 768 px, et la bascule 767, 768, 767 dans le même onglet
   **Then** à 767 px les critères 1 et 2 tiennent ; à 768 px la barre mobile est absente, comme à la base

## Notes

- Assumption : le correctif porte sur la barre `.mobile-tab-bar` seule, sans toucher la règle générique des onglets mobiles des autres pages.
- Assumption : à 320 px, le comportement n'est pas mesuré ; le plan le mesure et le consigne.
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : D9.2 devient un ticket.
- Relevé connecté du 2026-10-30, vrai plateau à 375 : barre de 385 px pour 375 ; Personnage, Bâtiments et Employés débordent de leur case de 75 px. Confirmé.
