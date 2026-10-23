---
title: "Une seule forme de focus clavier"
type: 'feature'
ticket: '7'
created: '2026-10-23'
status: 'dropped'
baseline_revision: '137416ccb6e19fa59b75f2352d653962e5b1c430'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le focus clavier a huit formes :
- halo rouge Kraland (`--kr-focus-ring`, `rgb(164, 18, 13)`) ;
- halo bleu en dur (`rgba(66, 153, 225, .1)`) ;
- halo orange ou `color-mix` ;
- `outline: none` sans remplacement (liens, quatre `!important`) ;
- trois anneaux en accent, en surbrillance, en primaire ou en `--kd-accent` ;
- l'anneau natif `-webkit-focus-ring-color` des boutons.

Sur certains éléments, le focus est invisible.

**Approach:** Un seul anneau de focus clavier, `:focus-visible` : contour de 2 px en `--kr-text-accent`, décalé de 2 px, sans halo. Il remplace partout les formes existantes, règles de la modale d'ordre comprises (H5.7, Q2, R7 ; CAP-4).

## Boundaries & Constraints

**Always:**
- Une règle commune aux deux supports et aux deux modes donne l'anneau (`outline: 2px solid var(--kr-text-accent)`, `outline-offset: 2px`).
- Les autres formes de focus et les `outline: none` sont retirées ou réécrites en place (P1 option 4) : halos rouge, bleu et orange, `--kr-focus-ring` et `--kr-focus-ring-light` (retirés), anneaux des autres couleurs. Font partie de ce lot les règles `:focus` de la modale d'ordre (onglets, champ de texte, sélecteur) ; les onglets de la barre du haut, la croix directionnelle, le tableau de bord et les cellules d'icônes, la barre d'outils, le kramail et les tableaux.
- La règle commune s'écrit sous la forme `@media (max-width: 767px), (min-width: 768px)` (note P1).
- L'anneau atteint au moins 3:1 sur le fond de l'élément, dans les 16 variantes (`tests/e2e/lib/variantes.mjs`). Là où un décalage de 2 px sortirait d'un conteneur qui coupe son contenu (`overflow: hidden`), le décalage peut être négatif, toujours en 2 px `--kr-text-accent`.
- Fixture synthétique.

**Never:**
- fonds et halo de l'onglet actif de la modale (ticket 2.6) ;
- changement des états `:hover` et `:active` ;
- anneau visible au clic de la souris (`:focus` seul ne dessine rien) ;
- variante high-contrast.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Contrôles | lien, bouton primaire, bouton standard, champ `.form-control`, case à cocher, `select`, onglet, entrée de liste ; focus clavier (Tab) ; 16 variantes ; 1280 et 375 px | contour 2 px `--kr-text-accent`, décalage 2 px, aucun `box-shadow` de focus, ≥ 3:1 sur le fond de l'élément | No error expected |
| Souris | même éléments cliqués (hors champs de saisie) | aucun anneau | No error expected |
| Modale d'ordre | onglets, champ de texte, sélecteur, boutons ; Tab ; 375 et 1280 px | même anneau | No error expected |
| Pages | barre du haut, croix, tableau de bord, kramail (barre d'outils, contacts), tableaux du sous-forum, carte de forum | même anneau (décalage éventuellement négatif dans un conteneur qui coupe) | No error expected |
| Restes | 16 variantes | aucun `rgb(164, 18, 13…)`, `rgba(66, 153, 225…)`, `rgba(212, 134, 62…)`, `#66afe9`, `-webkit-focus-ring-color` calculé au focus | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | même anneau | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` au `137416c` (lignes approximatives) :
  - jetons `--kr-focus-ring` l.46, `--kr-focus-ring-light` l.47, utilisés l.636, 661, 1928 ;
  - halos : `.form-control:focus` l.635, cases à cocher l.658, textarea de la modale l.1926, modale mobile `select[name=top]` l.7087 et textarea l.7649 (bleu, `!important`), `.form-control:focus` mobile l.9901 (`color-mix`), filtre DataTables du kramail l.9251 (orange, `!important`) ;
  - `outline: none` : `a:hover, a:focus` l.2264, DataTables sombre l.3841 (`!important`), barre d'outils l.9887 ;
  - anneaux d'autres couleurs : l.6526 (croix), l.12722, l.12778 (barre du haut, `!important`, décalage -2 px), l.13046 (cellules d'icônes), l.13455, l.8512 (DataTables, `--kr-primary`, `!important`), l.14057, kramail `--kd-accent` l.10752, 10836, 10890, 11096 ; déjà conforme : `.forum-card-link:focus` l.8367 ;
  - modale d'ordre : onglets `:focus` l.1211-1217 ; l'accolade ouverte l.1160 `@media (max-width: 767px)` se ferme l.2067, donc les règles l.1171-2066 ne valent que sur mobile.
- Bootstrap : `a:focus` et `.btn:focus` (contour 5 px natif), `.form-control:focus` (`#66afe9` et halo).
- Template : aucun style de focus en ligne.
- Tests :
  - `palette-nation.mjs` : `CSS.forcePseudoState`, `PROPS_DUR` (`outline-color`, `box-shadow`), contrôle de `#carte-forum:focus` ;
  - `plateau-qualite-usage.mjs` l.98-102 : `:focus-visible` montre l'étiquette `::after` (à garder) ;
  - `modale-ordre.mjs` : aucun contrôle de focus.

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/palette-nation.mjs` et une fixture dédiée (focus réel au clavier par `page.keyboard.press('Tab')`, et clic souris) ; `tests/e2e/modale-ordre.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [ ] `kraland-theme.css` -- anneau commun, formes de focus retirées ou réécrites, jetons de halo retirés
- [ ] suites touchées et comparaisons figées -- attentes mises à jour, écarts consignés
- [ ] `tests/e2e/lib/router.mjs` -- fragments nouveaux, aucune 4e citation d'un repère
- [ ] `npm run build`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne machine calme, then RÉSULTAT : VERT.
- Given une copie mutée du bundle, when la suite tourne, then elle est rouge. Mutations à essayer : halo rouge remis sur `.form-control:focus`, `outline: none !important` remis sur un champ, anneau de la croix en `--kr-highlight`.

## Implementation Notes

## Plan Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant, vert après
- `node tests/e2e/modale-ordre.mjs`, `node tests/e2e/plateau-qualite-usage.mjs`, `node tests/e2e/croix-directionnelle.mjs` -- expected: vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: conformes
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme
