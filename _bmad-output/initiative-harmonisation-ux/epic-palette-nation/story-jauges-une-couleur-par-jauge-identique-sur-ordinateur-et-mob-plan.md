---
title: "Jauges : une couleur par jauge, identique sur ordinateur et mobile"
type: 'feature'
ticket: '6'
created: '2026-10-23'
status: 'built'
baseline_revision: '412f0e82c837bce0c726143f65e29abd55516f9d'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les couleurs des jauges diffèrent selon le support.
- Sur ordinateur : PV et PM en `#5cb85c`, PP en `#f0ad4e` (Bootstrap 3).
- Sur mobile : `--kr-gauge-pv #28a745`, `--kr-gauge-pm #007bff` et `--kr-gauge-pp #ffc107` (Bootstrap 4, PP jaune).

Aucune de ces couleurs ne suit le mode sombre.

**Approach:** Chaque jauge a une couleur, identique sur ordinateur et sur mobile, avec un ton pour le clair et un pour le sombre (DESIGN.md › Jauges, H5.4, Q3 ; CAP-4) :

| Jauge | Clair | Sombre |
|---|---|---|
| PV | `#388e3c` | `#66bb6a` |
| PM | `#1565c0` | `#64b5f6` |
| PP | `#e65100` | `#ffa726` |

Le remplissage atteint au moins 3:1 sur le fond de sa piste.

## Boundaries & Constraints

**Always:** jetons `--kr-gauge-pv/-pm/-pp` redéfinis, en `:root` pour le clair et en `html[class*="-dark"]` pour le sombre. Les jauges du mini-profil mobile (compactes et complètes) et les barres PV, PM et PP du panneau du plateau sur ordinateur les consomment. Piste : `#f5f5f5` en clair, `bg-elevated` en sombre. La structure réelle des jauges sur ordinateur est relevée sur fixture ou, à défaut, par un relevé en lecture seule de `/jouer/plateau` via le Chrome dédié (CDP 9223) : squelette du DOM seulement, sans contenu ni action de jeu, visite consignée dans `revue-manuelle.md`. Fixture synthétique ; aucune capture HTML brute dans le dépôt.

**Never:** barres de PV des cartes de personnages (`.dashboard-card-hp-fill`, couleurs en ligne du template, épopée 5, Q30) ; couleurs d'état (3.5) ; tailles et formes des jauges.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Jetons | 16 variantes | jetons des jauges égaux à DESIGN.md (clair, sombre) | No error expected |
| Mobile | mini-profil plié et déplié, 375 × 667, 16 variantes | remplissages PV, PM, PP aux jetons ; ≥ 3:1 sur leur piste | No error expected |
| Ordinateur | panneau du plateau, 1280 px, 16 variantes | mêmes couleurs que sur mobile pour chaque jauge ; ≥ 3:1 sur leur piste ; aucun `#5cb85c`, `#f0ad4e`, `#28a745`, `#007bff`, `#ffc107` | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes couleurs | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` : jetons l.129-132 (`:root`) ; mini-profil compact l.4969-5018 et complet l.5038-5090 (`.mobile-gauge-*-fill.pv/.pm/.pp`, `!important`) ; barres de l'ordinateur à localiser (`.progress-bar`, mobile l.4422).
- Template : extraction des jauges du panneau `findGaugeInSection` L1337-1390 (texte « PV 27 », barre `.progress-bar` ou `[class*="bar"]` avec `style.width`) ; rendu mobile L1473+.
- Tests : `tests/e2e/plateau-profil-mobile.mjs` (HTML enrichi du plateau, mini-profil), `tests/e2e/palette-nation.mjs` (jetons, `CONTRASTE`, `parVariante`) ; fixture `plateau-qualite-usage.html`.

## Tasks & Acceptance

**Execution:**
- [x] relevé de la structure des jauges de l'ordinateur (fixture, sinon visite en lecture seule consignée)
- [x] `tests/e2e/palette-nation.mjs` et une fixture de plateau avec jauges -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-theme.css` -- jetons clair et sombre ; règle de l'ordinateur sur les jetons
- [x] `tests/e2e/lib/router.mjs` -- fragments nouveaux, aucune 4e citation d'un repère
- [x] `npm run build`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne machine calme, then RÉSULTAT : VERT.
- Given une copie mutée du bundle (PP remis en `#ffc107`, barre de l'ordinateur remise en `#5cb85c`), when la suite tourne, then elle est rouge.

## Implementation Notes

- Relevé : aucune fixture n'avait les jauges du panneau. Visite en lecture seule de `/jouer/plateau` à 1280 px (CDP 9223), squelette seul, consignée dans `revue-manuelle.md`. Structure : `div.t.row` (futur `#player-vitals-section`) ; par jauge, `.col-sm-4` avec `a.btn.alert141` (PV), `alert142` (PM) ou `alert143` (PP), puis `.col-sm-8 > .progress` à deux segments `.progress-bar-success` (valeur) et `.progress-bar-warning` (reste), largeurs en ligne complémentaires. PM et PP partagent la seconde `.row`.
- Fixture synthétique `tests/e2e/fixtures/palette-nation-jauges.html` : `plateau-qualite-usage.html` avec ce squelette (valeurs inventées) et le vrai Bootstrap 3.3.7, servie à `/jouer/plateau`.
- CSS : jetons en `:root` et `html[class*="-dark"]`, plus `--kr-gauge-track` (`#f5f5f5`, `var(--kr-bg-elevated)` en sombre) posé sur les pistes du mini-profil (avant : `--kr-border-default`) et sur `#player-vitals-section .progress`. Ordinateur, `@media (min-width: 768px)` : `.col-sm-4:has(.alertN) + .col-sm-8 .progress > .progress-bar:first-child` (toute classe) sur le jeton de la jauge ; segments suivants transparents, sans ombre (après revue : la valeur peut changer de classe avec le niveau ; variante « classes » de la fixture, valeur de PV en `-danger` et de PM en `-warning`) (le reste se fond dans la piste, comme sur mobile ; décision consignée dans `revue-manuelle.md`).
- Tests : fragments `jauges-mobile`, `jauges-bureau`, `jauges-largeurs` de `palette-nation.mjs` (186 contrôles). Le mot « mini-profil » est évité dans la suite : il y aurait été la 4e citation de ce repère.
- Contre-épreuves (copies jetables du bundle) : PP remis en `#ffc107` : 45 FAIL ; barre PV de l'ordinateur remise en `#5cb85c` : 40 FAIL ; ancienne règle (`.progress-bar-success` seul, `.progress-bar-warning` transparent) : 32 FAIL sur la variante « classes ».
- Défaut antérieur trouvé en revue : PM et PP du mini-profil affichent la valeur des PV (`findGaugeInSection`), confirmé sur la fixture ; ticket `_bmad-output/backlog/bug-jauges-pm-et-pp-du-mini-profil-affichent-les-pv.md` (backlog/9), non corrigé ici.

## Plan Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant, vert après
- `node tests/e2e/plateau-profil-mobile.mjs` -- expected: vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: conformes
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme

Passe quick du 2026-10-23 (boucle 0) : 1 low (patch), 1 low (patch, document), 1 medium (defer, préexistant).
- low, patch — la couleur ne visait que `.progress-bar-success` et le segment `-warning` devenait transparent quelle que soit sa place : premier segment coloré quelle que soit sa classe, suivants transparents ; variante de fixture `[classes]` (contre-épreuve : 32 FAIL).
- low, patch (document) — piste mobile à peine distincte de `bg-surface` (≈ 1,09:1) : point de validation visuelle ajouté à `revue-manuelle.md`.
- medium, defer — `findGaugeInSection` (template) donne à PM et PP les valeurs de PV : défaut antérieur, confirmé sur fixture, ticket `backlog/9`.

Vérification finale : build validé ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant) ; `test:unit` vert ; skills identiques ; `test:all` 6005 ok, 0 FAIL, RÉSULTAT : VERT, machine calme.
