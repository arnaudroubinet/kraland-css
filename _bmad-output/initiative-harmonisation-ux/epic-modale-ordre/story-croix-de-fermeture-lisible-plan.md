---
title: "Croix de fermeture lisible"
type: 'feature'
ticket: '5'
created: '2026-10-22'
status: 'built'
baseline_revision: '061fd4af3547e14f85a26ac177071ca33ad47dd2'
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

**Problem:** La croix de fermeture des modales d'ordre (`button.bootbox-close-button.close`, dans `.modal-body`) garde le style Bootstrap sur ordinateur : noire, opacité 0,2, environ 13 × 21 px, contraste 1,2:1 en sombre ; sur mobile, noire à opacité 0,7, sans couleur du thème.

**Approach:** Dans les modales d'ordre, sur ordinateur et mobile, la croix prend la couleur du texte du thème, sans voile d'opacité, un contraste ≥ 3:1 sur le fond de la modale et une zone de 44 × 44 px, à la même place (H2.6 ; CAP-3 ; Q25.4 : place native gardée).

## Boundaries & Constraints

**Always:** limité aux modales marquées `kr-order-modal` (socle du ticket 2.2) ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)` ou liste combinée pour une règle commune ; P1 option 4 : la règle mobile commune `body.mobile-mode .modal-header .close, body.mobile-mode .bootbox-close-button` (~l.6568) est réécrite pour ne plus viser les modales d'ordre, plutôt que surchargée ; contrastes vérifiés dans les 16 variantes avec `tests/e2e/lib/variantes.mjs`.

**Never:** déplacer la croix ; changer la croix des autres modales Bootbox ; toucher les pastilles, « Valider » ou l'onglet actif.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ordinateur | modale d'ordre, 768 à 1920 px | croix 44 × 44 px, couleur du texte du thème, opacité 1, ≥ 3:1 sur le fond de la modale | No error expected |
| Mobile | modale d'ordre, 375 et 767 px | idem | No error expected |
| Variantes | 16 variantes | ≥ 3:1 partout | No error expected |
| Touchée | toucher ou clic au centre de la croix | la modale se ferme sans valider (`elementFromPoint` renvoie la croix) | No error expected |
| Autre modale | `bootbox.confirm` hors ordre | croix inchangée | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` : règle mobile commune ~l.6566-6578 (`body.mobile-mode .modal-header .close, body.mobile-mode .bootbox-close-button` : 44 px, `opacity: 0.7 !important`, `z-index: 120`) ; `.bootbox-confirm .alert .close` (~l.1794, croix des alertes, hors périmètre) ; Bootstrap `.close` : `color: #000; opacity: .2; text-shadow: 0 1px 0 #fff; font-size: 21px`.
- Socle : `kr-order-modal` posé par `applyOrderModal` (template, section « MODAL PERSONNAGE MOBILE »).
- Tests : `tests/e2e/modale-ordre.mjs` (fragments `mobile`, `bureau`, `largeurs`, `seuil`, `variantes`), `tests/e2e/lib/variantes.mjs` (`CONTRASTE`, `parVariante`).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/modale-ordre.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-theme.css` -- croix des modales d'ordre lisible sur les deux supports ; règle mobile commune réécrite sans viser les modales d'ordre
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre dans chacune des 16 variantes, when elle s'ouvre, then la croix mesure 44 × 44 px et son contraste est ≥ 3:1
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

- Fichiers : `kraland-theme.css` (section 9g en liste combinée `@media (max-width: 767px), (min-width: 768px)` : `.kr-order-modal .bootbox-close-button` à 44 × 44 px, rembourrage 10 px, glyphe de 28 px sur 24 px d'interligne, `position: relative` et `z-index: 120` repris de la règle mobile commune, `color: var(--kr-text-primary)`, `text-shadow: none`, `opacity: 1` ; règle mobile commune réécrite en `body.mobile-mode .modal-header .close:not(.kr-order-modal *), body.mobile-mode .bootbox-close-button:not(.kr-order-modal *)`, déclarations inchangées) ; `tests/e2e/modale-ordre.mjs` (297 contrôles, mêmes fragments : mesure `CROIX`, geste `fermerParLaCroix`, assertion `lisible`, relevé `CROIX_HORS_ORDRE` ; l'outil de contraste est posé dans chaque page par `ouvrirPage`) ; bundle et `version.json`.
- Matrice : Ordinateur et Mobile = un contrôle par largeur (375, 767, 768, 769, 1280, 1440, 1920 px : Dormir et Pouvoir à l'ouverture, contenu remplacé, chargement Ajax à 375 et 1280, survol de la souris hors contexte tactile) et un par transition de seuil (769 / 767, dans les deux sens) ; Variantes = un contrôle par variante à 375 et 1280 px ; Touchée = un contrôle par largeur (toucher à 375, clic ailleurs, après un autre ordre) ; Autre modale = un contrôle par largeur (relevé des styles de la croix hors ordre).
- Place native (Q25.4) : la croix reste le premier enfant du corps, flottante à droite, avec la marge en ligne de Bootbox ; son coin haut droit ne bouge pas (celui de la croix d'une confirmation hors ordre) et la zone de 44 × 44 px s'étend vers la gauche et vers le bas. Sur mobile, la géométrie est celle d'avant (règle commune) ; seules la couleur, l'opacité et l'ombre changent.
- Effet de bord sur ordinateur : l'image flottante du titre de l'ordre (`h3 > div.pull-right`, 80 × 80 px) se range désormais à gauche de la croix (44 px plus à gauche, même hauteur) au lieu de passer sous elle ; le bloc des alertes et la suite de l'ordre ne bougent pas. Alternative écartée : marge négative sous la croix pour garder l'image au bord droit, la croix chevauchant alors le coin de l'image (glyphe posé sur l'image, contraste non garanti).
- Survol et focus : `.close:hover` et `.close:focus` de Bootstrap (noir à 0,5) ont la même spécificité que la règle ; la feuille du thème, déplacée en fin de `<head>`, l'emporte. Vérifié au survol de la souris.
- Contrastes mesurés (375 et 1280 px, 16 variantes, Dormir et Pouvoir) : 14,75:1 (Confédération libre sombre) à 17,97:1 (variantes claires) ; Empire Brun sombre 15,40:1, comme la maquette.
- Vérification : rouge avant le code (bundle de HEAD, sources de 061fd4a) : 41 FAIL sur 297, soit les 41 contrôles de lisibilité (7 largeurs, 2 transitions, 32 variantes) ; les contrôles « touchée » et « hors ordre » passaient déjà (gardes de non-régression). Vert après : 297 ok. Contre-épreuves sur copies mutées du bundle hors dépôt (fragments mobile et bureau), toutes rouges : règle commune visant encore les modales d'ordre (opacité 0,7 sur mobile) ; règle étendue à toutes les croix (croix hors ordre changée) ; sans `opacity: 1` ; spécificité abaissée par `:where()` (croix noire au survol) ; `pointer-events: none` (centre recouvert, geste impossible) ; sans 44 × 44 ; `float: none` (croix déplacée) ; sans couleur du thème. `test:parler` 78 ok ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant, `report-non-lu.mjs`) ; `test:all` 4659 ok, 0 FAIL, RÉSULTAT : VERT (modale-ordre 297, parler-viewport 78).
- Non fait : vérification sur le site réel (pas de mandat) ; ligne de zone du skill `tester-kraland-css` non complétée (croix de fermeture), hors plan.
- Correctifs de revue (2026-10-23), qui remplacent les détails ci-dessus quand ils divergent :
  - Fenêtre rétrécie sous 768 px sans rechargement (`body` sans `mobile-mode`) : le corps n'a plus de padding (9c) et la marge en ligne de Bootbox (−10 px) coupait le haut de la croix (zone visible 44 × 34). Correctif : `margin-top: 0 !important` sous `body:not(.mobile-mode)` dans un bloc `max-width: 767px`, comme 9e pour les alertes. `lisible` mesure maintenant la zone visible (intersection avec la boîte de découpe du corps, en valeurs fractionnaires) : rouge avant (767 px : 44 × 34), vert après.
  - Glyphe à sa place native : la règle commune garde zone, z-index, police, couleur, ombre et opacité ; rembourrage de 10 px sur mobile (glyphe centré, inchangé) ; sur ordinateur, `padding: 0 0 20px` et `text-align: right` (un bouton centre son contenu en hauteur) mettent le glyphe au coin haut droit de la zone. Centre du glyphe à 1280 et 1920 px : 2,1 px à gauche et 1 px sous celui de la croix de Bootstrap ; identique sur mobile. `lisible` compare ce centre (Range) à celui de la croix hors ordre de même largeur, à 3 px près : rouge avant (écart de 15,7 et 11 px, de 768 à 1920 px), vert après.
  - Image du titre (`h3 > div.pull-right`) : toujours 44 px plus à gauche (950 au lieu de 994 à 1280 px), même hauteur. Le décalage vient de la zone flottante de 44 × 44 px qui réserve sa place (L1 de la revue de faisabilité : « réserver la place de la croix »), pas du glyphe. Le supprimer demanderait une marge basse de −14 px : le contenu suivant (coin de l'image ici, sélecteur de personnage d'autres ordres selon L1) passerait sous le bas de la zone, où un clic fermerait la modale. Décalage conservé.
  - Contre-épreuves rouges : marge négative non annulée (767 px : 44 × 34) ; glyphe centré sur ordinateur ; glyphe à droite mais centré en hauteur. `modale-ordre.mjs` 297 ok ; `test:parler` 78 ok ; `lint:css` 0 ; ESLint de la suite 0.

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

## Review Triage Log

Passe quick du 2026-10-22 : 2 low, patch.
- low, patch — croix rognée à 44 × 34 px à 767 px après 769 → 767 sans rechargement (`body` sans `mobile-mode`, marge en ligne de −10 px de Bootbox) : marge annulée dans cet état ; mesure de la zone visible (intersection avec la boîte de découpe du corps).
- low, patch — glyphe déplacé d'environ 15 px vers la gauche et 11 px vers le bas sur ordinateur (centré dans la zone de 44 px) : glyphe calé en haut à droite sur ordinateur, centre à 2,1 px et 1 px du centre natif ; contrôle à toutes les largeurs.
- conservé — l'image du titre (`h3 > div.pull-right`) se place 44 px plus à gauche : la zone flottante de la croix lui réserve sa place (L1 de la revue de faisabilité) ; la supprimer ferait passer du contenu sous la zone de la croix.

Vérification : `modale-ordre.mjs` 297 ok ; contre-épreuves rouges (marge, glyphe centré, glyphe centré en hauteur, et les 8 premières) ; `test:parler` 78 ok ; `test:router` conforme ; `test:unit` 56/56 ; `lint:css`, `lint:js` 0 erreur ; `test:all` 4659 ok, 0 FAIL. Site réel (lecture seule, modale Dormir annulée) : croix 44 × 44 px, couleur du texte du thème, opacité 1, à 375 et 1280 px, deux variantes. Captures : `.tmp/captures/validation-2-5-croix/` (hors git).
