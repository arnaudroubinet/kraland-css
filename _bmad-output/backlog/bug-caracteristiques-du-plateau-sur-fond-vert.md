---
id: 13
type: bug
title: "Les caractéristiques du plateau ont un fond vert au lieu du fond neutre des compétences"
parent: none
covers: []
after: [11]
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Les caractéristiques du plateau ont un fond vert au lieu du fond neutre des compétences

## Description

Les six caractéristiques du personnage (Force, Volonté, Charme, Gestion, Intelligence, Perception) s'affichent sur un fond vert plein, sur tous les thèmes. C'est le cas dans la colonne latérale sur ordinateur et dans le mini-profil sur mobile. Les compétences, juste en dessous, ont le fond neutre des boutons standard. Le vert jure avec les thèmes, en particulier avec Empire Brun sombre (capture d'Arnaud du 2026-10-25).

Le site code chaque caractéristique en bouton d'état succès (`btn btn-success alert121` à `alert126`). Le mini-profil mobile clone ces boutons en leur ajoutant `mobile-characteristic-badge`. Depuis le ticket 3.5 (palette d'états), tout bouton d'état succès prend la couleur `--kr-success`.

Decision: 2026-10-25 — Arnaud : « Oui je veux le même fond neutre. » Les caractéristiques prennent le fond neutre des compétences.

## Reproduction

1. Fixture `plateau-qualite-usage.html`, thème Empire Brun sombre, à 1280 × 720, puis à 375 × 667 avec le mini-profil déplié.
2. Attendu : les caractéristiques ont le fond, la bordure et le texte des compétences, au repos, au survol et à l'appui.
3. Constaté : le fond et la bordure prennent `--kr-success` (`#81c784` en sombre, `#2e7d32` en clair), le texte prend `--kr-bg-surface`, et le badge de valeur prend la paire inverse.

## Cause Hypothesis

Les règles des boutons d'état de la palette (ticket 3.5) visent tout `.btn-success`. Elles ne distinguent pas une caractéristique d'un vote ou d'un score. Les exceptions des caractéristiques ajoutées par le 3.5 (survol PLT-11, `.panel-body a:hover` mobile, appui `.mobile-characteristic-badge`) font que leur survol et leur appui gardent la couleur d'état. P1 option 4 : réécrire l'origine (exclure les caractéristiques de la palette, retirer les exceptions devenues inutiles), sans ajouter de règle qui la batte ni de nouvel `!important`.

## Acceptance Criteria

1. **Caractéristiques au fond neutre**
   **Given** les caractéristiques `btn-success` du plateau, sur ordinateur (colonne latérale) et sur mobile (mini-profil plié puis déplié)
   **When** la page est rendue à 375, 767, 768 et 1280 px, en Kraland clair et en Empire Brun sombre
   **Then** fond, bordure, couleur du texte et badge de valeur sont égaux à ceux d'une compétence de la même page, au repos, au survol et à l'appui
2. **Les autres boutons d'état gardent leur couleur**
   **Given** les votes du sujet (`span.btn.btn-success`), le score des messages mobiles et les alertes « Bienvenue »
   **When** ils sont rendus
   **Then** ils gardent la couleur d'état du ticket 3.5
3. **Tests couvrent le cas**
   **Given** les contrôles `etats-pages-*` de `palette-nation` réécrits sur le fond neutre
   **When** la suite tourne
   **Then** elle passe, et échoue sur le bundle de la base (caractéristiques vertes)
4. **Autre issue valide**
   **Given** Kraland pose aussi `btn-warning` ou `btn-danger` sur une caractéristique
   **When** le cas est connu
   **Then** il est consigné, et seul `btn-success` est neutralisé

## Boundaries

- Must not change : couleurs des compétences, pastilles de valeur des compétences, cibles tactiles (44 px au moins), mise en grille du mini-profil.
- Must not change : palette d'états des autres éléments (votes, scores, alertes, étiquettes, panneaux).
- Must not change : pièce courante du plateau (`.btn-warning` à image de pièce) et marque PNJ (`.btn-danger.xmini`).

## References

- plan — _bmad-output/initiative-harmonisation-ux/epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md, périmètre et Implementation Notes (caractéristiques survolées et pressées)

## Notes

- Assumption: seul `btn-success` est neutralisé. Si une caractéristique peut porter `btn-warning` ou `btn-danger` (malus), cet état reste visible.
- Open question: Kraland change-t-il la classe d'une caractéristique selon l'état du personnage ? À vérifier sur le site en lecture seule (mandat du 2026-10-23), ou à défaut dans les fixtures.
- `after: [11]` : le backlog 11 réaligne les bases des suites e2e, dont `palette-nation`.
