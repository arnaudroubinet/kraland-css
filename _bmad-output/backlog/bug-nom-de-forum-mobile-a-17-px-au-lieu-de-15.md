---
id: 10
type: bug
title: "Sur mobile, le nom de forum de l'index passe à 17 px au lieu de 15"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, le nom de forum de l'index passe à 17 px au lieu de 15

## Description

Constat F2 de la rétrospective de l'épopée 4. Sur mobile, `h1, h2, h3 { font-size: var(--kr-font-section-title) !important; }` (`kraland-theme.css` ~l.4782, ticket 4.5) bat `.forum-title` (~l.8035, sans `!important`, ticket 4.7). Le template crée un `<h3 class="forum-title">` (~l.4899), donc le nom de forum de l'index mobile prend 17 px au lieu de 15 px. Les tests ne le voient pas : la fixture `palette-nation-textes.html` (l.63) utilise un `span.forum-title`.

Constats voisins de la même rétrospective, à traiter dans ce ticket :
- F3 : sur mobile, l'ordre du pied des modales Bootbox (~l.7061-7066) ne couvre que `.btn-default` et `.btn-primary`. Un `.btn-danger` ou `.btn-success` passerait avant « Annuler », alors que le commentaire 9h (~l.2235) dit que ces règles « reproduisent l'ordre natif ».
- F5 : jetons jamais lus (`--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad`) ; commentaire « compacts (4.3) » ~l.15049 à corriger en « 4.4 ».

## Reproduction

1. Index du forum mobile à 375 × 667, bundle `be63eea`, avec un `h3.forum-title` (DOM produit par le template).
2. Attendu : nom de forum en 15 px (`--kr-font-name`). Constaté à la lecture de la source : 17 px. **À mesurer au rouge avant.**

## Cause Hypothesis

La règle des titres h1-h3 mobile en `!important` s'applique à tout `h3`, y compris ceux que le template crée pour des noms. P1 option 4 : réécrire l'origine (exclure `.forum-title` de la règle des titres, ou viser les titres de section seulement), sans ajouter de règle qui la batte.

## Acceptance Criteria

1. **Nom de forum à 15 px sur mobile**
   **Given** l'index du forum mobile avec le `h3.forum-title` réel du template
   **When** la page est rendue à 375 et 767 px
   **Then** le nom de forum est en 15 px, et les titres de section restent à 17 px
2. **Pied Bootbox mobile dans l'ordre natif**
   **Given** une modale Bootbox mobile avec un bouton `.btn-danger` ou `.btn-success`
   **When** elle s'ouvre
   **Then** « Annuler » garde sa place native, ou le commentaire 9h dit exactement ce que les règles couvrent
3. **Tests couvrent le cas**
   **Given** la fixture alignée sur le `h3` réel
   **When** la suite tourne
   **Then** elle passe, et échoue sur le bundle `be63eea`

## Boundaries

- Must not change : tailles de l'échelle (ticket 4.1), titres de section à 17 px, graisse du nom de forum (question ouverte à Arnaud).

## References

- retro — _bmad-output/initiative-harmonisation-ux/epic-typographie-formes/epic-typographie-formes-retrospective.md, F2, F3, F5
